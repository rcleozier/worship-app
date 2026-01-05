/**
 * Calculate accurate reading duration based on text content
 * Accounts for verse reading, lesson summary, and reflection time
 */

export function calculateReadingDuration(
  verses: Array<{ text: string }>,
  lesson?: { summary?: string; keyIdea?: string; reflectionQuestion?: string }
): number {
  // Average reading speed: ~150 words per minute for comfortable reading
  // TTS speed: ~150-180 words per minute depending on voice
  
  let totalWords = 0
  
  // Count verse words
  verses.forEach((verse) => {
    totalWords += verse.text.split(/\s+/).length
  })
  
  // Add lesson content if provided (for context, not always read aloud)
  if (lesson) {
    if (lesson.summary) {
      totalWords += lesson.summary.split(/\s+/).length * 0.3 // 30% weight (optional reading)
    }
    if (lesson.keyIdea) {
      totalWords += lesson.keyIdea.split(/\s+/).length * 0.2 // 20% weight
    }
  }
  
  // Add reference reading (e.g., "John chapter 3, verse 16" = ~5 words)
  totalWords += 5
  
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

