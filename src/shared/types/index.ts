export interface ScreenInfo {
  id: number;
  name: string;
  width: number;
  height: number;
}

export interface Participant {
  id: string;
  name: string;
  isSharing: boolean;
  isMuted: boolean;
}

export interface RoomInfo {
  id: string;
  participants: Participant[];
  createdAt: number;
}

export interface WebRTCStats {
  fps: number;
  latency: number;
  bitrate: number;
  packetLoss: number;
}
