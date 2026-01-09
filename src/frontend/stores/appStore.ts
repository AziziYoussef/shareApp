import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Participant {
  id: string;
  name: string;
  isSharing: boolean;
  isMuted: boolean;
}

interface AppState {
  isConnected: boolean;
  roomId: string | null;
  userName: string | null;
  participants: Participant[];
  isSharing: boolean;
  isMuted: boolean;
  selectedScreen: number | null;
  quality: "1080p" | "720p" | "480p";
  fps: number;
  latency: number;
  bitrate: number;
  remoteStreams: Map<string, MediaStream>;

  // Actions
  setConnected: (connected: boolean) => void;
  setRoomId: (roomId: string | null) => void;
  setUserName: (userName: string | null) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  setIsSharing: (sharing: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setSelectedScreen: (screen: number | null) => void;
  setQuality: (quality: "1080p" | "720p" | "480p") => void;
  setFps: (fps: number) => void;
  setLatency: (latency: number) => void;
  setBitrate: (bitrate: number) => void;
  setRemoteStream: (userId: string, stream: MediaStream) => void;
  removeRemoteStream: (userId: string) => void;
  clearAll: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isConnected: false,
      roomId: null,
      userName: null,
      participants: [],
      isSharing: false,
      isMuted: false,
      selectedScreen: null,
      quality: "1080p",
      fps: 60,
      latency: 0,
      bitrate: 0,
      remoteStreams: new Map(),

      setConnected: (connected) => set({ isConnected: connected }),
      setRoomId: (roomId) => set({ roomId }),
      setUserName: (userName) => set({ userName }),
      addParticipant: (participant) =>
        set((state) => {
          // Éviter les doublons
          if (state.participants.some((p) => p.id === participant.id)) {
            return state;
          }
          return {
            participants: [...state.participants, participant],
          };
        }),
      removeParticipant: (id) =>
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id),
        })),
      updateParticipant: (id, updates) =>
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      setIsSharing: (sharing) => set({ isSharing: sharing }),
      setIsMuted: (muted) => set({ isMuted: muted }),
      setSelectedScreen: (screen) => set({ selectedScreen: screen }),
      setQuality: (quality) => set({ quality }),
      setFps: (fps) => set({ fps }),
      setLatency: (latency) => set({ latency }),
      setBitrate: (bitrate) => set({ bitrate }),
      setRemoteStream: (userId, stream) =>
        set((state) => {
          const newStreams = new Map(state.remoteStreams);
          newStreams.set(userId, stream);
          return { remoteStreams: newStreams };
        }),
      removeRemoteStream: (userId) =>
        set((state) => {
          const newStreams = new Map(state.remoteStreams);
          newStreams.delete(userId);
          return { remoteStreams: newStreams };
        }),
      clearAll: () =>
        set({
          isConnected: false,
          roomId: null,
          userName: null,
          participants: [],
          isSharing: false,
          remoteStreams: new Map(),
        }),
    }),
    {
      name: "screen-share-storage",
      partialize: (state) => ({
        roomId: state.roomId,
        userName: state.userName,
      }),
    }
  )
);
