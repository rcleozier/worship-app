/**
 * Text-to-Speech utility using Web Speech API
 * Provides audio narration for Bible verses
 */

export interface TTSOptions {
  rate?: number // 0.1 to 10, default 1
  pitch?: number // 0 to 2, default 1
  volume?: number // 0 to 1, default 1
  voice?: SpeechSynthesisVoice | null
}

class TTSService {
  private utterance: SpeechSynthesisUtterance | null = null
  private isSpeaking = false
  private startTime = 0
  private duration = 0
  private onProgress?: (progress: number) => void
  private onComplete?: () => void

  constructor() {
    // Check if browser supports speech synthesis
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported in this browser")
    }
  }

  /**
   * Get available voices, preferring English voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return []
    }
    return speechSynthesis.getVoices().filter((voice) => 
      voice.lang.startsWith("en")
    )
  }

  /**
   * Get the best voice for Bible reading (prefer premium, natural voices)
   * Uses improved voice selection algorithm
   */
  getBestVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices()
    if (voices.length === 0) return null

    // Priority order for better quality voices:
    // 1. Neural/premium voices (Google, Microsoft, Amazon)
    // 2. High-quality system voices (Samantha, Alex, Daniel on macOS; Zira on Windows)
    // 3. Male voices (often sound more natural for Bible reading)
    
    const voiceNames = voices.map(v => v.name.toLowerCase())
    
    // Try to find neural/premium voices first
    const neuralVoices = voices.filter(
      (v) => {
        const name = v.name.toLowerCase()
        return (
          name.includes("neural") ||
          name.includes("premium") ||
          name.includes("enhanced") ||
          name.includes("wave") ||
          name.includes("google") ||
          name.includes("microsoft") ||
          name.includes("amazon")
        )
      }
    )

    if (neuralVoices.length > 0) {
      // Prefer male voices among neural options
      const maleNeural = neuralVoices.find(
        (v) => {
          const name = v.name.toLowerCase()
          return (
            name.includes("male") ||
            name.includes("daniel") ||
            name.includes("david") ||
            name.includes("mark") ||
            name.includes("alex")
          )
        }
      )
      return maleNeural || neuralVoices[0]
    }

    // Try high-quality system voices (macOS and Windows premium voices)
    const systemPremium = voices.filter(
      (v) => {
        const name = v.name.toLowerCase()
        return (
          name.includes("samantha") || // macOS high-quality female
          name.includes("alex") || // macOS high-quality male
          name.includes("daniel") || // macOS high-quality male
          name.includes("zira") || // Windows high-quality female
          name.includes("david") // Windows high-quality male
        )
      }
    )

    if (systemPremium.length > 0) {
      // Prefer male voices
      const maleSystem = systemPremium.find(
        (v) => {
          const name = v.name.toLowerCase()
          return (
            name.includes("alex") ||
            name.includes("daniel") ||
            name.includes("david")
          )
        }
      )
      return maleSystem || systemPremium[0]
    }

    // Fallback to any male voices
    const maleVoices = voices.filter(
      (v) => {
        const name = v.name.toLowerCase()
        return (
          name.includes("male") ||
          name.includes("david") ||
          name.includes("daniel") ||
          name.includes("mark") ||
          name.includes("alex")
        )
      }
    )

    if (maleVoices.length > 0) {
      return maleVoices[0]
    }

    // Final fallback: first English voice
    return voices[0] || null
  }

  /**
   * Speak text with options
   */
  speak(
    text: string,
    options: TTSOptions = {},
    callbacks?: {
      onProgress?: (progress: number) => void
      onComplete?: () => void
    }
  ): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Speech synthesis not available")
      return
    }

    // Cancel any existing speech
    this.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Set voice
    const voice = options.voice || this.getBestVoice()
    if (voice) {
      utterance.voice = voice
    }

    // Set options with optimized values for natural speech
    utterance.rate = Math.max(0.5, Math.min(2, options.rate ?? 1)) // Clamp between 0.5 and 2
    utterance.pitch = Math.max(0.5, Math.min(2, options.pitch ?? 1)) // Clamp between 0.5 and 2
    utterance.volume = Math.max(0, Math.min(1, options.volume ?? 1)) // Clamp between 0 and 1
    
    // Adjust pitch slightly lower for more natural Bible reading
    if (!options.pitch) {
      utterance.pitch = 0.95 // Slightly lower pitch sounds more natural
    }

    // Estimate duration (rough calculation: ~150 words per minute at 1x speed)
    const wordCount = text.split(/\s+/).length
    const wordsPerMinute = 150 * (options.rate ?? 1)
    this.duration = (wordCount / wordsPerMinute) * 60 // in seconds
    this.startTime = Date.now()

    // Store callbacks
    this.onProgress = callbacks?.onProgress
    this.onComplete = callbacks?.onComplete

    // Set up event handlers
    utterance.onstart = () => {
      this.isSpeaking = true
      this.startTime = Date.now()
    }

    utterance.onend = () => {
      this.isSpeaking = false
      this.utterance = null
      if (this.onComplete) {
        this.onComplete()
      }
    }

    utterance.onerror = (event) => {
      console.error("TTS Error:", event.error)
      this.isSpeaking = false
      this.utterance = null
    }

    // Progress tracking
    if (this.onProgress) {
      const progressInterval = setInterval(() => {
        if (!this.isSpeaking) {
          clearInterval(progressInterval)
          return
        }

        const elapsed = (Date.now() - this.startTime) / 1000 // in seconds
        const progress = Math.min(elapsed / this.duration, 1)
        this.onProgress(progress)

        if (progress >= 1) {
          clearInterval(progressInterval)
        }
      }, 100) // Update every 100ms
    }

    this.utterance = utterance
    speechSynthesis.speak(utterance)
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return
    }
    if (this.isSpeaking) {
      speechSynthesis.pause()
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return
    }
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
    }
  }

  /**
   * Cancel/stop current speech
   */
  cancel(): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return
    }
    speechSynthesis.cancel()
    this.isSpeaking = false
    this.utterance = null
    this.startTime = 0
    this.duration = 0
  }

  /**
   * Check if currently speaking
   */
  getIsSpeaking(): boolean {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return false
    }
    return this.isSpeaking && speechSynthesis.speaking
  }

  /**
   * Check if paused
   */
  getIsPaused(): boolean {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return false
    }
    return speechSynthesis.paused
  }
}

// Singleton instance
export const ttsService = new TTSService()

// Load voices when available (voices load asynchronously)
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  // Load voices immediately if available
  if (speechSynthesis.getVoices().length > 0) {
    // Voices already loaded
  } else {
    // Wait for voices to load
    speechSynthesis.onvoiceschanged = () => {
      // Voices loaded
    }
  }
}

