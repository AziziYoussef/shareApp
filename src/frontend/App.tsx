import { useAppStore } from "./stores/appStore";
import ScreenShare from "./components/ScreenShare/ScreenShare";
import AudioControls from "./components/AudioControls/AudioControls";
import ParticipantsList from "./components/ParticipantsList/ParticipantsList";
import RoomManager from "./components/RoomManager/RoomManager";
import SettingsPanel from "./components/SettingsPanel/SettingsPanel";
import DebugPanel from "./components/DebugPanel/DebugPanel";

function App() {
  const { isConnected } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Screen Share App</h1>
          <p className="text-muted-foreground">Partage d'écran et audio en temps réel</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-4">
            <RoomManager />
            {isConnected && (
              <>
                <ScreenShare />
                <AudioControls />
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ParticipantsList />
            <SettingsPanel />
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
}

export default App;
