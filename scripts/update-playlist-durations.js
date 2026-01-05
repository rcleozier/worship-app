/**
 * Script to update playlist durations based on actual content
 * Run with: node scripts/update-playlist-durations.js
 */

const fs = require('fs');
const path = require('path');

function calculateDuration(verses, lesson) {
  let totalWords = 0;
  
  // Count verse words
  verses.forEach((verse) => {
    totalWords += verse.text.split(/\s+/).length;
  });
  
  // Add reference reading (~8 words for verse ranges)
  totalWords += 8;
  
  // Calculate minutes: words / wordsPerMinute (140 WPM for TTS)
  const wordsPerMinute = 140;
  const minutes = totalWords / wordsPerMinute;
  
  // Round to nearest 0.5 minute, minimum 1 minute
  return Math.max(1, Math.round(minutes * 2) / 2);
}

// This is a helper script - the actual updates will be done in the JSON file
console.log('Use this function to calculate accurate durations:');
console.log('calculateDuration(verses, lesson)');

