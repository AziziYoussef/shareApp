import { useAppStore } from "../../stores/appStore";
import { Settings, Monitor, Gauge } from "lucide-react";

export default function SettingsPanel() {
  const { quality, setQuality, fps, latency, bitrate } = useAppStore();

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Paramètres</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Qualité vidéo
          </label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as "1080p" | "720p" | "480p")}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            <option value="1080p">1080p (FHD)</option>
            <option value="720p">720p (HD)</option>
            <option value="480p">480p (SD)</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4" />
            <span className="font-medium">Statistiques</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1 pl-6">
            <div>FPS: {fps}</div>
            <div>Latence: {latency}ms</div>
            <div>Bitrate: {(bitrate / 1000).toFixed(1)} Mbps</div>
          </div>
        </div>
      </div>
    </div>
  );
}
