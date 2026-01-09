import { useState } from "react";
import { useAppStore } from "../../stores/appStore";
import { Copy, Users, LogIn, LogOut } from "lucide-react";
import { useWebRTC } from "../../hooks/useWebRTC";

export default function RoomManager() {
  const { isConnected, roomId, userName: storedUserName, setRoomId, setUserName: setStoredUserName } = useAppStore();
  const [inputRoomId, setInputRoomId] = useState("");
  const [userName, setUserName] = useState(storedUserName || "");
  const { connect, disconnect, createRoom } = useWebRTC();

  const handleCreateRoom = async () => {
    if (!userName.trim()) {
      alert("Veuillez entrer un nom d'utilisateur");
      return;
    }
    try {
      const newRoomId = await createRoom(userName);
      setRoomId(newRoomId);
      setStoredUserName(userName);
    } catch (error) {
      console.error("Failed to create room:", error);
      alert("Erreur lors de la création de la salle");
    }
  };

  const handleJoinRoom = async () => {
    if (!userName.trim() || !inputRoomId.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    try {
      await connect(inputRoomId, userName);
      setRoomId(inputRoomId);
      setStoredUserName(userName);
    } catch (error) {
      console.error("Failed to join room:", error);
      alert("Erreur lors de la connexion à la salle");
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to leave room:", error);
    }
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      alert("Code de salle copié !");
    }
  };

  if (isConnected && roomId) {
    return (
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Salle active
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Code: <span className="font-mono font-semibold">{roomId}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyRoomId}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copier
            </button>
            <button
              onClick={handleLeaveRoom}
              className="px-3 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Quitter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Rejoindre ou créer une salle</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Votre nom"
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Code de salle (optionnel pour créer)
          </label>
          <input
            type="text"
            value={inputRoomId}
            onChange={(e) => setInputRoomId(e.target.value)}
            placeholder="Entrez le code de salle"
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCreateRoom}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            Créer une salle
          </button>
          <button
            onClick={handleJoinRoom}
            disabled={!inputRoomId.trim()}
            className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Rejoindre
          </button>
        </div>
      </div>
    </div>
  );
}
