import { useEffect, useRef } from "react";
import { useAppStore } from "../../stores/appStore";
import { useWebRTC } from "../../hooks/useWebRTC";
import { Play, Square, Monitor } from "lucide-react";

export default function ScreenShare() {
  const { isSharing, setIsSharing, remoteStreams, participants } = useAppStore();
  const { startSharing } = useWebRTC();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    // Nettoyer le stream quand le composant est démonté
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Logger les streams distants pour débug
  useEffect(() => {
    console.log("Remote streams updated:", remoteStreams.size);
    remoteStreams.forEach((stream, userId) => {
      console.log(`Stream from ${userId}:`, stream.getTracks());
    });
  }, [remoteStreams]);

  // Assurer que la vidéo locale est bien attachée
  useEffect(() => {
    if (isSharing && streamRef.current && videoRef.current) {
      console.log("Attaching local stream to video element");
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.error("Error playing local video:", err);
      });
    }
  }, [isSharing]);

  const handleStartShare = async () => {
    try {
      // Vérifier que l'API est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error("L'API de capture d'écran n'est pas disponible dans ce navigateur");
      }

      console.log("Requesting screen share...");

      // Utiliser l'API getDisplayMedia du navigateur pour capturer l'écran
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
        },
      });

      console.log("Screen share granted, stream tracks:", stream.getTracks());

      // Assigner le stream à l'élément video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Forcer le démarrage de la vidéo
        try {
          await videoRef.current.play();
          console.log("Video playback started");
        } catch (playError) {
          console.error("Error playing video:", playError);
        }
      }

      // Écouter la fin du partage (quand l'utilisateur arrête dans le navigateur)
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        console.log("Screen share ended by user");
        handleStopShare();
      });

      // Partager le stream via WebRTC
      console.log("Sharing stream via WebRTC...");
      await startSharing(stream);

      setIsSharing(true);
      console.log("Screen share active");
    } catch (error) {
      console.error("Failed to start screen share:", error);
      let errorMessage = "Impossible de démarrer le partage d'écran";

      if (error instanceof Error) {
        if (error.name === "NotAllowedError" || error.message.includes("cancelled")) {
          errorMessage = "Le partage d'écran a été annulé ou refusé";
        } else {
          errorMessage = `Erreur: ${error.message}`;
        }
      }

      alert(errorMessage);
      setIsSharing(false);
    }
  };

  const handleStopShare = () => {
    try {
      // Arrêter le stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setIsSharing(false);
    } catch (error) {
      console.error("Failed to stop screen share:", error);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Partage d'écran
        </h2>
        <div className="flex gap-2">
          {!isSharing ? (
            <button
              onClick={handleStartShare}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Démarrer
            </button>
          ) : (
            <button
              onClick={handleStopShare}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Arrêter
            </button>
          )}
        </div>
      </div>

      {!isSharing && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Cliquez sur "Démarrer" pour sélectionner l'écran à partager
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Mon partage d'écran */}
        {isSharing && streamRef.current && (
          <div className="bg-black rounded-lg aspect-video flex flex-col overflow-hidden">
            <div className="bg-green-600/80 px-3 py-2">
              <p className="text-sm font-medium text-white">Votre partage (vous)</p>
            </div>
            <div className="flex-1 flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Partages d'écran des participants */}
        {Array.from(remoteStreams.entries()).map(([userId, stream]) => {
          const participant = participants.find((p) => p.id === userId);
          return (
            <div key={userId} className="bg-black rounded-lg aspect-video flex flex-col overflow-hidden">
              <div className="bg-secondary/50 px-3 py-2">
                <p className="text-sm font-medium">
                  {participant?.name || "Utilisateur inconnu"}
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <video
                  ref={(el) => {
                    if (el && stream) {
                      el.srcObject = stream;
                      remoteVideoRefs.current.set(userId, el);
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          );
        })}

        {/* Message quand aucun partage */}
        {!isSharing && remoteStreams.size === 0 && (
          <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Aucun partage actif</p>
              <p className="text-xs text-muted-foreground">
                Cliquez sur "Démarrer" pour partager votre écran
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
