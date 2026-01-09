/**
 * Utility functions for WebRTC operations
 */

export const STUN_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export const VIDEO_CONSTRAINTS = {
  "1080p": { width: 1920, height: 1080, frameRate: 60 },
  "720p": { width: 1280, height: 720, frameRate: 60 },
  "480p": { width: 854, height: 480, frameRate: 30 },
} as const;

export const AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 48000,
  channelCount: 2,
};

/**
 * Get video constraints based on quality setting
 */
export function getVideoConstraints(
  quality: "1080p" | "720p" | "480p"
): MediaTrackConstraints {
  return VIDEO_CONSTRAINTS[quality];
}

/**
 * Calculate statistics from RTCStatsReport
 */
export async function calculateStats(
  pc: RTCPeerConnection
): Promise<{ fps: number; latency: number; bitrate: number }> {
  const stats = await pc.getStats();
  let totalBitrate = 0;
  let totalLatency = 0;
  let frameCount = 0;

  stats.forEach((report) => {
    if (report.type === "inbound-rtp" || report.type === "outbound-rtp") {
      const rtpReport = report as any;
      if (rtpReport.mediaType === "video") {
        totalBitrate += rtpReport.bytesReceived || rtpReport.bytesSent || 0;
        if (rtpReport.framesPerSecond) {
          frameCount += rtpReport.framesPerSecond;
        }
      }
    }
    if (report.type === "remote-inbound-rtp") {
      const remoteReport = report as any;
      if (remoteReport.roundTripTime) {
        totalLatency += remoteReport.roundTripTime * 1000; // Convert to ms
      }
    }
  });

  return {
    fps: frameCount || 0,
    latency: totalLatency || 0,
    bitrate: (totalBitrate * 8) / 1000000, // Convert to Mbps
  };
}

/**
 * Generate a random room ID
 */
export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}
