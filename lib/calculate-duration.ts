/**
 * Calculate accurate reading duration based on text content
 * Accounts for verse reading, lesson summary, and reflection time
 */

export function calculateReadingDuration(
  verses: Array<{ text: string }>,
  lesson?: { 
    summary?: string
    keyIdea?: string
    reflectionQuestion?: string
    lifeSituation?: string
    behavioralTakeaway?: string
  }
): number {
  // Average reading speed: ~150 words per minute for comfortable reading
  // TTS speed: ~150-180 words per minute depending on voice
  
  let totalWords = 0
  
  // Count verse words
  verses.forEach((verse) => {
    totalWords += verse.text.split(/\s+/).length
  })
  
  // Add lesson content - now fully read aloud, so full weight
  if (lesson) {
    // Life situation intro text: "This shows up in real life when..." = ~8 words
    if (lesson.lifeSituation) {
      totalWords += 8 + lesson.lifeSituation.split(/\s+/).length
    }
    
    // Transition text: "Here's what this means for you." = ~6 words
    if (lesson.summary || lesson.keyIdea || lesson.behavioralTakeaway) {
      totalWords += 6
    }
    
    // Summary is fully read
    if (lesson.summary) {
      totalWords += lesson.summary.split(/\s+/).length
    }
    
    // Key idea intro: "The key idea is:" = ~4 words
    if (lesson.keyIdea) {
      totalWords += 4 + lesson.keyIdea.split(/\s+/).length
    }
    
    // Behavioral takeaway intro: "Here's something to try:" = ~5 words
    if (lesson.behavioralTakeaway) {
      totalWords += 5 + lesson.behavioralTakeaway.split(/\s+/).length
    }
  }
  
  // Add reference reading (e.g., "John 3:16." = ~3 words)
  totalWords += 3
  
  // Calculate minutes: words / wordsPerMinute
  // Use 140 WPM for TTS (slightly slower than reading)
  const wordsPerMinute = 140
  const minutes = totalWords / wordsPerMinute
  
  // Round to nearest 0.5 minute, minimum 1 minute
  return Math.max(1, Math.round(minutes * 2) / 2)
}

/**
 * Calculate duration for a full passage (multiple verses)
 */
export function calculatePassageDuration(verses: Array<{ text: string }>): number {
  let totalWords = 0
  
  verses.forEach((verse) => {
    totalWords += verse.text.split(/\s+/).length
  })
  
  // Add reference reading
  totalWords += 8 // "Book chapter X, verses Y to Z" = ~8 words
  
  const wordsPerMinute = 140
  const minutes = totalWords / wordsPerMinute
  
  return Math.max(1, Math.round(minutes * 2) / 2)
}

