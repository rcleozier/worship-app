/**
 * TTS Voice Utilities
 * Helper functions for managing and selecting high-quality voices
 */

export interface VoiceInfo {
  name: string
  lang: string
  isNeural?: boolean
  isPremium?: boolean
  gender?: "male" | "female"
  quality?: "high" | "medium" | "low"
}

/**
 * Get all available voices with metadata
 */
export function getAvailableVoices(): VoiceInfo[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return []
  }

  const voices = speechSynthesis.getVoices()
  return voices
    .filter((v) => v.lang.startsWith("en"))
    .map((voice) => {
      const name = voice.name.toLowerCase()
      return {
        name: voice.name,
        lang: voice.lang,
        isNeural:
          name.includes("neural") ||
          name.includes("premium") ||
          name.includes("enhanced") ||
          name.includes("wave"),
        isPremium:
          name.includes("google") ||
          name.includes("microsoft") ||
          name.includes("amazon"),
        gender: name.includes("male") || name.includes("daniel") || name.includes("david") || name.includes("alex")
          ? "male"
          : name.includes("female") || name.includes("samantha") || name.includes("zira")
          ? "female"
          : undefined,
        quality: name.includes("neural") || name.includes("premium") || name.includes("enhanced")
          ? "high"
          : name.includes("google") || name.includes("microsoft") || name.includes("samantha") || name.includes("alex")
          ? "high"
          : "medium",
      }
    })
    .sort((a, b) => {
      // Sort by quality: high > medium > low
      const qualityOrder = { high: 3, medium: 2, low: 1 }
      const aQuality = qualityOrder[a.quality || "low"]
      const bQuality = qualityOrder[b.quality || "low"]
      if (aQuality !== bQuality) return bQuality - aQuality

      // Then by neural/premium
      if (a.isNeural && !b.isNeural) return -1
      if (!a.isNeural && b.isNeural) return 1
      if (a.isPremium && !b.isPremium) return -1
      if (!a.isPremium && b.isPremium) return 1

      return 0
    })
}

/**
 * Get the best available voice for Bible reading
 */
export function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices()
  if (voices.length === 0) return null

  const speechVoices = speechSynthesis.getVoices()
  
  // Find the highest quality voice
  for (const voiceInfo of voices) {
    const voice = speechVoices.find((v) => v.name === voiceInfo.name)
    if (voice && voiceInfo.quality === "high") {
      return voice
    }
  }

  // Fallback to first available
  return speechVoices.find((v) => v.lang.startsWith("en")) || null
}

/**
 * List all high-quality voices for user selection
 */
export function getHighQualityVoices(): VoiceInfo[] {
  return getAvailableVoices().filter(
    (v) => v.quality === "high" || v.isNeural || v.isPremium
  )
}

