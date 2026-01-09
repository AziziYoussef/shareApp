import { useAppStore } from "../../stores/appStore";
import { Users, Mic, MicOff, Monitor } from "lucide-react";

export default function ParticipantsList() {
  const { participants, userName } = useAppStore();

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5" />
        <h3 className="text-lg font-semibold">
          Participants ({participants.length + 1})
        </h3>
      </div>

      <div className="space-y-2">
        {/* Current user */}
        <div className="flex items-center gap-3 p-2 rounded-md bg-secondary/50">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {userName?.charAt(0).toUpperCase() || "V"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{userName || "Vous"} (Vous)</p>
          </div>
          <div className="flex gap-2">
            <Mic className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Other participants */}
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-semibold">
              {participant.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{participant.name}</p>
            </div>
            <div className="flex gap-2">
              {participant.isSharing && (
                <Monitor className="w-4 h-4 text-primary" />
              )}
              {participant.isMuted ? (
                <MicOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Mic className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
        ))}

        {participants.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun autre participant
          </p>
        )}
      </div>
    </div>
  );
}
