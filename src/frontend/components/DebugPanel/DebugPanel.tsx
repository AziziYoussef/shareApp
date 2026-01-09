import { useState } from "react";
import { useAppStore } from "../../stores/appStore";
import { useWebRTCStore } from "../../stores/webrtcStore";
import { Bug } from "lucide-react";

export default function DebugPanel() {
  const { isConnected, roomId, userName, participants, remoteStreams } = useAppStore();
  const { socket, peerConnections, localStream } = useWebRTCStore();
  const [show, setShow] = useState(false);

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-4 right-4 p-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600"
        title="Debug Panel"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-card border rounded-lg p-4 shadow-lg max-w-md max-h-96 overflow-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Bug className="w-4 h-4" />
          Debug Info
        </h3>
        <button
          onClick={() => setShow(false)}
          className="text-sm px-2 py-1 hover:bg-secondary rounded"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs font-mono">
        <div>
          <strong>Connected:</strong> {isConnected ? "✅" : "❌"}
        </div>
        <div>
          <strong>Socket:</strong> {socket?.connected ? "✅" : "❌"}
        </div>
        <div>
          <strong>Room ID:</strong> {roomId || "N/A"}
        </div>
        <div>
          <strong>User Name:</strong> {userName || "N/A"}
        </div>
        <div>
          <strong>Participants:</strong> {participants.length}
          <ul className="pl-4">
            {participants.map((p) => (
              <li key={p.id}>
                {p.name} ({p.id.slice(0, 8)}...) {p.isSharing ? "📺" : ""}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Peer Connections:</strong> {peerConnections.size}
          <ul className="pl-4">
            {Array.from(peerConnections.entries()).map(([userId, pc]) => (
              <li key={userId}>
                {userId.slice(0, 8)}... - {pc.connectionState}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Local Stream:</strong>{" "}
          {localStream ? `${localStream.getTracks().length} tracks` : "None"}
        </div>
        <div>
          <strong>Remote Streams:</strong> {remoteStreams.size}
          <ul className="pl-4">
            {Array.from(remoteStreams.entries()).map(([userId, stream]) => (
              <li key={userId}>
                {userId.slice(0, 8)}... - {stream.getTracks().length} tracks
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
