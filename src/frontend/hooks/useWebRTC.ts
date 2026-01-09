import { useEffect } from "react";
import { useAppStore } from "../stores/appStore";
import { useWebRTCStore } from "../stores/webrtcStore";
import { io } from "socket.io-client";

// URL du serveur de signalisation (configurable via variable d'environnement)
const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || "http://localhost:3001";

export function useWebRTC() {
  const {
    roomId,
    userName,
    addParticipant,
    removeParticipant,
    updateParticipant,
    setRemoteStream,
    removeRemoteStream,
    setConnected,
  } = useAppStore();

  const {
    socket,
    localStream,
    setSocket,
    setPeerConnection,
    removePeerConnection,
    setLocalStream,
  } = useWebRTCStore();

  // Reconnexion automatique au refresh si on était dans une salle
  useEffect(() => {
    // Vérifier qu'on n'est pas déjà connecté
    const currentSocket = useWebRTCStore.getState().socket;

    if (roomId && userName && !currentSocket?.connected) {
      console.log("Reconnecting to room:", roomId);
      connect(roomId, userName).catch((error) => {
        console.error("Reconnection failed:", error);
        // En cas d'échec, nettoyer l'état pour permettre une nouvelle tentative manuelle
        useAppStore.getState().clearAll();
      });
    }
  }, [roomId, userName]);

  // Cleanup au démontage du composant
  useEffect(() => {
    return () => {
      // Ne pas déconnecter automatiquement pour permettre la persistance
      console.log("useWebRTC hook unmounting");
    };
  }, []);

  const createRoom = async (userName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const newSocket = io(SIGNALING_SERVER_URL);
      const newRoomId = Math.random().toString(36).substring(2, 9).toUpperCase();

      newSocket.on("connect", () => {
        newSocket.emit("create-room", { roomId: newRoomId, userName });
        setSocket(newSocket);
        setupSocketListeners(newSocket);
        setConnected(true);
        resolve(newRoomId);
      });

      newSocket.on("connect_error", (error) => {
        reject(error);
      });
    });
  };

  const connect = async (roomId: string, userName: string) => {
    return new Promise<void>((resolve, reject) => {
      const newSocket = io(SIGNALING_SERVER_URL);

      newSocket.on("connect", () => {
        newSocket.emit("join-room", { roomId, userName });
        setSocket(newSocket);
        setupSocketListeners(newSocket);
        setConnected(true);
        resolve();
      });

      newSocket.on("connect_error", (error) => {
        reject(error);
      });
    });
  };

  const disconnect = async () => {
    useWebRTCStore.getState().clearAll();
    useAppStore.getState().clearAll();
  };

  const setupSocketListeners = (socketInstance: typeof socket) => {
    if (!socketInstance) return;

    socketInstance.on("user-joined", async ({ userId, userName }: { userId: string; userName: string }) => {
      console.log("User joined:", userId, userName);

      // Vérifier si on a déjà une connexion avec cet utilisateur
      const existingPc = useWebRTCStore.getState().peerConnections.get(userId);
      if (!existingPc) {
        await createPeerConnection(userId, userName, true, socketInstance);
      } else {
        console.log("Already have connection with", userId);
      }
    });

    socketInstance.on("room-users", async (users: Array<{ userId: string; userName: string }>) => {
      console.log("Room users:", users);

      for (const user of users) {
        // Vérifier si on a déjà une connexion
        const existingPc = useWebRTCStore.getState().peerConnections.get(user.userId);
        if (!existingPc) {
          await createPeerConnection(user.userId, user.userName, true, socketInstance);
        } else {
          console.log("Already have connection with", user.userId);
        }
      }
    });

    socketInstance.on("user-left", ({ userId }: { userId: string }) => {
      console.log("User left:", userId);
      removePeerConnection(userId);
      removeParticipant(userId);
      removeRemoteStream(userId);
    });

    socketInstance.on("offer", async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      console.log("Received offer from:", from);
      await handleOffer(from, offer, socketInstance);
    });

    socketInstance.on("answer", async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
      console.log("Received answer from:", from);
      await handleAnswer(from, answer);
    });

    socketInstance.on("ice-candidate", async ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
      await handleIceCandidate(from, candidate);
    });
  };

  const createPeerConnection = async (
    userId: string,
    userName: string,
    isInitiator: boolean,
    socketInstance: typeof socket
  ) => {
    // Vérifier si on a déjà une connexion avec cet utilisateur
    const existingPc = useWebRTCStore.getState().peerConnections.get(userId);
    if (existingPc) {
      console.log("Peer connection already exists for", userId, "- reusing it");
      return existingPc;
    }

    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    console.log("Creating new RTCPeerConnection for", userId);
    const pc = new RTCPeerConnection(configuration);

    // Add local stream tracks
    const currentLocalStream = useWebRTCStore.getState().localStream;
    if (currentLocalStream) {
      currentLocalStream.getTracks().forEach((track) => {
        pc.addTrack(track, currentLocalStream);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log("Received remote track from", userId);
      const [remoteStream] = event.streams;
      if (remoteStream) {
        setRemoteStream(userId, remoteStream);
        updateParticipant(userId, { isSharing: true });
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketInstance) {
        socketInstance.emit("ice-candidate", {
          to: userId,
          candidate: event.candidate,
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${userId}:`, pc.connectionState);
      if (pc.connectionState === "connected") {
        updateParticipant(userId, { isSharing: true });
      } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        updateParticipant(userId, { isSharing: false });
      }
    };

    setPeerConnection(userId, pc);
    addParticipant({ id: userId, name: userName, isSharing: false, isMuted: false });

    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      if (socketInstance) {
        socketInstance.emit("offer", { to: userId, offer });
      }
    }

    return pc;
  };

  const handleOffer = async (from: string, offer: RTCSessionDescriptionInit, socketInstance: typeof socket) => {
    console.log("Received offer from:", from);

    // Vérifier si on a déjà une connexion avec cet utilisateur
    let pc = useWebRTCStore.getState().peerConnections.get(from);

    if (!pc) {
      // Créer une nouvelle connexion
      console.log("Creating new peer connection for", from);
      pc = await createPeerConnection(from, "Unknown", false, socketInstance);
    } else {
      console.log("Reusing existing peer connection for", from);

      // Gérer le cas où on a déjà une négociation en cours (glare)
      if (pc.signalingState === "have-local-offer") {
        console.log("Glare detected! Resolving by comparing IDs");
        const currentSocket = useWebRTCStore.getState().socket;
        const localId = currentSocket?.id || "";

        // Le peer avec l'ID le plus "petit" gagne et garde son offer
        if (localId < from) {
          console.log("We win the glare, ignoring remote offer");
          return;
        } else {
          console.log("Remote wins the glare, rolling back our offer");
          await pc.setLocalDescription({ type: "rollback" } as RTCSessionDescriptionInit);
        }
      }
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (socketInstance) {
        socketInstance.emit("answer", { to: from, answer });
        console.log("Sent answer to", from);
      }
    } catch (error) {
      console.error("Error handling offer from", from, error);
    }
  };

  const handleAnswer = async (from: string, answer: RTCSessionDescriptionInit) => {
    const pc = useWebRTCStore.getState().peerConnections.get(from);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = async (from: string, candidate: RTCIceCandidateInit) => {
    const pc = useWebRTCStore.getState().peerConnections.get(from);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const startSharing = async (stream: MediaStream) => {
    console.log("startSharing called with stream:", stream.getTracks());
    setLocalStream(stream);

    const currentPeerConnections = useWebRTCStore.getState().peerConnections;
    const currentSocket = useWebRTCStore.getState().socket;

    if (!currentSocket) {
      console.warn("No socket available for sharing");
      return;
    }

    if (currentPeerConnections.size === 0) {
      console.log("No peer connections yet, stream will be added when connections are created");
      return;
    }

    // Ajouter les tracks du stream à toutes les connexions peer existantes et renégocier
    for (const [userId, pc] of currentPeerConnections.entries()) {
      console.log(`Processing peer ${userId}, state: ${pc.signalingState}`);

      // Vérifier si on n'a pas déjà ajouté ces tracks
      const existingSenders = pc.getSenders();
      const existingTrackIds = existingSenders.map(s => s.track?.id).filter(Boolean);

      // Ajouter seulement les nouveaux tracks
      const newTracks = stream.getTracks().filter(track => !existingTrackIds.includes(track.id));

      if (newTracks.length === 0) {
        console.log(`All tracks already added to ${userId}`);
        continue;
      }

      console.log(`Adding ${newTracks.length} new tracks to peer ${userId}`);

      // Ajouter les nouveaux tracks
      newTracks.forEach((track) => {
        pc.addTrack(track, stream);
        console.log(`Added track ${track.kind} to ${userId}`);
      });

      // Renégocier la connexion seulement si elle est stable
      if (pc.signalingState === "stable") {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          currentSocket.emit("offer", { to: userId, offer });
          console.log(`Sent new offer to ${userId}`);
        } catch (error) {
          console.error(`Failed to renegotiate with ${userId}:`, error);
        }
      } else {
        console.log(`Skipping renegotiation for ${userId} - signaling state is ${pc.signalingState}`);
      }
    }
  };

  return {
    createRoom,
    connect,
    disconnect,
    startSharing,
    socket,
    localStream,
  };
}
