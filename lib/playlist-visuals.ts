/**
 * Visual identity system for playlists
 * Each preset includes gradient, mood color, and background image concept
 * Designed to create emotional clarity and warmth for beginners
 */

export interface PlaylistVisual {
  gradient: string
  overlay: string
  moodColor: string
  bgImage: string // CSS background image URL or gradient
  imageUrl?: string // Optional: actual image URL from Unsplash or similar
  textColor: string
}

// Visual presets mapped by playlist ID or tags
export const playlistVisuals: Record<string, PlaylistVisual> = {
  "start-here": {
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    overlay: "bg-gradient-to-br from-amber-500/60 via-orange-500/50 to-rose-500/60",
    moodColor: "amber",
    // Warm sunrise image - welcoming, safe, beginning
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop",
    bgImage: "radial-gradient(ellipse at top, rgba(251, 191, 36, 0.4) 0%, rgba(249, 115, 22, 0.3) 40%, rgba(244, 63, 94, 0.2) 100%), linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(249, 115, 22, 0.15) 50%, rgba(244, 63, 94, 0.1) 100%)",
    textColor: "text-white",
  },
  "peace-and-comfort": {
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    overlay: "bg-gradient-to-br from-emerald-500/60 via-teal-500/50 to-cyan-500/60",
    moodColor: "emerald",
    // Calm nature scene - peace, tranquility, growth
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop",
    bgImage: "radial-gradient(ellipse at bottom, rgba(16, 185, 129, 0.35) 0%, rgba(20, 184, 166, 0.25) 50%, rgba(6, 182, 212, 0.15) 100%), linear-gradient(180deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)",
    textColor: "text-white",
  },
  "love-and-relationships": {
    gradient: "from-pink-400 via-rose-500 to-fuchsia-500",
    overlay: "bg-gradient-to-br from-pink-500/60 via-rose-500/50 to-fuchsia-500/60",
    moodColor: "rose",
    // Soft, warm tones - love, connection, warmth
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80&auto=format&fit=crop",
    bgImage: "radial-gradient(circle at center, rgba(244, 114, 182, 0.35) 0%, rgba(244, 63, 94, 0.25) 50%, rgba(217, 70, 239, 0.15) 100%), linear-gradient(135deg, rgba(244, 114, 182, 0.2) 0%, rgba(217, 70, 239, 0.1) 100%)",
    textColor: "text-white",
  },
  "faith-and-trust": {
    gradient: "from-violet-400 via-purple-500 to-indigo-600",
    overlay: "bg-gradient-to-br from-violet-500/60 via-purple-500/50 to-indigo-600/60",
    moodColor: "violet",
    // Deep, contemplative - faith, trust, depth
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80&auto=format&fit=crop",
    bgImage: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.35) 0%, rgba(168, 85, 247, 0.25) 50%, rgba(79, 70, 229, 0.15) 100%), linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(79, 70, 229, 0.1) 100%)",
    textColor: "text-white",
  },
  "gratitude-and-joy": {
    gradient: "from-yellow-400 via-amber-500 to-orange-500",
    overlay: "bg-gradient-to-br from-yellow-500/60 via-amber-500/50 to-orange-500/60",
    moodColor: "yellow",
    // Bright, uplifting - joy, gratitude, light
    imageUrl: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80&auto=format&fit=crop",
    bgImage: "radial-gradient(circle at top, rgba(250, 204, 21, 0.4) 0%, rgba(245, 158, 11, 0.3) 50%, rgba(249, 115, 22, 0.2) 100%), linear-gradient(180deg, rgba(250, 204, 21, 0.25) 0%, rgba(249, 115, 22, 0.1) 100%)",
    textColor: "text-white",
  },
  "strength-and-courage": {
    gradient: "from-blue-500 via-indigo-600 to-purple-600",
    overlay: "bg-gradient-to-br from-blue-500/60 via-indigo-600/50 to-purple-600/60",
    moodColor: "blue",
    // Strong, confident - strength, courage, power
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop",
    bgImage: "radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.35) 0%, rgba(79, 70, 229, 0.25) 50%, rgba(147, 51, 234, 0.15) 100%), linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)",
    textColor: "text-white",
  },
}

/**
 * Get visual preset for a playlist
 * Falls back to a default warm gradient if not found
 */
export function getPlaylistVisual(playlistId: string, tags: string[] = []): PlaylistVisual {
  // Check by ID first
  if (playlistVisuals[playlistId]) {
    return playlistVisuals[playlistId]
  }

  // Check by tags
  for (const tag of tags) {
    if (tag === "peace" || tag === "comfort") {
      return playlistVisuals["peace-and-comfort"]
    }
    if (tag === "love" || tag === "relationships") {
      return playlistVisuals["love-and-relationships"]
    }
    if (tag === "faith" || tag === "trust") {
      return playlistVisuals["faith-and-trust"]
    }
    if (tag === "gratitude" || tag === "joy") {
      return playlistVisuals["gratitude-and-joy"]
    }
    if (tag === "strength" || tag === "courage") {
      return playlistVisuals["strength-and-courage"]
    }
  }

  // Default warm gradient
  return {
    gradient: "from-slate-500 via-slate-600 to-slate-700",
    overlay: "bg-gradient-to-br from-slate-500/40 via-slate-600/30 to-slate-700/40",
    moodColor: "slate",
    bgImage: "linear-gradient(135deg, rgba(100, 116, 139, 0.3) 0%, rgba(71, 85, 105, 0.3) 100%)",
    textColor: "text-white",
  }
}

