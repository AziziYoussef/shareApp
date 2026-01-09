import { create } from "zustand";
import { Socket } from "socket.io-client";

interface WebRTCState {
  socket: Socket | null;
  peerConnections: Map<string, RTCPeerConnection>;
  localStream: MediaStream | null;

  setSocket: (socket: Socket | null) => void;
  setPeerConnection: (userId: string, pc: RTCPeerConnection) => void;
  removePeerConnection: (userId: string) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  clearAll: () => void;
}

export const useWebRTCStore = create<WebRTCState>((set, get) => ({
  socket: null,
  peerConnections: new Map(),
  localStream: null,

  setSocket: (socket) => set({ socket }),

  setPeerConnection: (userId, pc) =>
    set((state) => {
      const newConnections = new Map(state.peerConnections);
      newConnections.set(userId, pc);
      return { peerConnections: newConnections };
    }),

  removePeerConnection: (userId) =>
    set((state) => {
      const pc = state.peerConnections.get(userId);
      if (pc) {
        pc.close();
      }
      const newConnections = new Map(state.peerConnections);
      newConnections.delete(userId);
      return { peerConnections: newConnections };
    }),

  setLocalStream: (stream) => {
    const oldStream = get().localStream;
    if (oldStream && oldStream !== stream) {
      oldStream.getTracks().forEach((track) => track.stop());
    }
    set({ localStream: stream });
  },

  clearAll: () => {
    const state = get();

    // Fermer toutes les connexions peer
    state.peerConnections.forEach((pc) => pc.close());

    // Arrêter le stream local
    if (state.localStream) {
      state.localStream.getTracks().forEach((track) => track.stop());
    }

    // Déconnecter le socket
    if (state.socket) {
      state.socket.disconnect();
    }

    set({
      socket: null,
      peerConnections: new Map(),
      localStream: null,
    });
  },
}));
