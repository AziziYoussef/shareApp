import { useState, useEffect, useRef } from "react";
import { useAppStore } from "../../stores/appStore";
import { useWebRTCStore } from "../../stores/webrtcStore";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export default function AudioControls() {
  const { isMuted, setIsMuted } = useAppStore();
  const { socket } = useWebRTCStore();
  const [volume, setVolume] = useState(100);
  const [isDeafened, setIsDeafened] = useState(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const audioSendersRef = useRef<RTCRtpSender[]>([]);

  // Initialiser le microphone au montage
  useEffect(() => {
    if (socket?.connected) {
      startMicrophone();
    }

    return () => {
      stopMicrophone();
    };
  }, [socket]);

  const startMicrophone = async () => {
    try {
      console.log("Starting microphone...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
      });

      setMicStream(stream);
      console.log("Microphone started, tracks:", stream.getTracks());

      // Ajouter les tracks audio à toutes les connexions peer
      const currentPeerConnections = useWebRTCStore.getState().peerConnections;
      const senders: RTCRtpSender[] = [];

      currentPeerConnections.forEach((pc) => {
        stream.getAudioTracks().forEach((track) => {
          const sender = pc.addTrack(track, stream);
          senders.push(sender);
          console.log("Added audio track to peer connection");
        });
      });

      audioSendersRef.current = senders;
    } catch (error) {
      console.error("Failed to start microphone:", error);
    }
  };

  const stopMicrophone = () => {
    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
      setMicStream(null);
      console.log("Microphone stopped");
    }
  };

  const toggleMute = () => {
    if (micStream) {
      micStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted; // Inverse car on va toggle après
      });
    }
    setIsMuted(!isMuted);
    console.log("Microphone", !isMuted ? "muted" : "unmuted");
  };

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened);
    if (!isDeafened) {
      setIsMuted(true);
      if (micStream) {
        micStream.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
      }
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4">Contrôles audio</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-lg ${
              isMuted
                ? "bg-destructive text-destructive-foreground"
                : "bg-green-600 text-white"
            } hover:opacity-90 transition-opacity`}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1">
            <span className="text-sm block">
              {isMuted ? "Microphone désactivé" : "Microphone activé"}
            </span>
            {micStream && !isMuted && (
              <span className="text-xs text-green-600 font-medium">
                🎤 En direct
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDeafen}
            className={`p-3 rounded-lg ${
              isDeafened
                ? "bg-destructive text-destructive-foreground"
                : "bg-secondary text-secondary-foreground"
            } hover:opacity-90 transition-opacity`}
          >
            {isDeafened ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <span className="flex-1 text-sm">
            {isDeafened ? "Audio désactivé" : "Audio activé"}
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            disabled={isDeafened}
            className="w-full"
          />
          <div className="text-xs text-muted-foreground text-right">
            {volume}%
          </div>
        </div>
      </div>
    </div>
  );
}
