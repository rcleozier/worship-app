/**
 * Visual identity system for Bible books
 * Each book gets a unique image and gradient to create visual distinction
 */

export interface BookVisual {
  gradient: string
  overlay: string
  moodColor: string
  imageUrl: string // Unique Unsplash image for each book
  textColor: string
}

/**
 * Curated list of diverse Unsplash image IDs for variety
 * Each book will get a unique image based on its name hash
 */
const unsplashImageIds = [
  "1506905925346-21bda4d32df4", // Mountain landscape
  "1509316785289-025f5b846b35", // Desert
  "1519681393784-d120267933ba", // Sunset
  "1518837695005-2083093ee35b", // Ocean waves
  "1441974231531-c6227db76b6e", // Forest
  "1501594907352-04cda38ebc29", // Mountain range
  "1470071459604-3b5ec3a7fe05", // Lake
  "1495616811223-4d98c6e9c869", // Sunrise
  "1507003211169-0a1dd7228f2d", // Desert landscape
  "1469474968028-56695f4e46da", // Mountain peak
  "1505142468610-3595f1dcdd23", // Forest path
  "1511593358241-7eea1f3c84e5", // Valley
  "1506905925346-21bda4d32df4", // Alpine
  "1518837695005-2083093ee35b", // Coastal
  "1441974231531-c6227db76b6e", // Wilderness
  "1501594907352-04cda38ebc29", // Panoramic
  "1470071459604-3b5ec3a7fe05", // Serene
  "1495616811223-4d98c6e9c869", // Dawn
  "1509316785289-025f5b846b35", // Vast
  "1506905925346-21bda4d32df4", // Majestic
  "1519681393784-d120267933ba", // Peaceful
  "1518837695005-2083093ee35b", // Tranquil
  "1441974231531-c6227db76b6e", // Lush
  "1501594907352-04cda38ebc29", // Expansive
  "1470071459604-3b5ec3a7fe05", // Calm
  "1495616811223-4d98c6e9c869", // Bright
  "1507003211169-0a1dd7228f2d", // Dramatic
  "1469474968028-56695f4e46da", // Elevated
  "1505142468610-3595f1dcdd23", // Enchanted
  "1511593358241-7eea1f3c84e5", // Warm
  "1506905925346-21bda4d32df4", // Cool
  "1518837695005-2083093ee35b", // Deep
  "1441974231531-c6227db76b6e", // Rich
  "1501594907352-04cda38ebc29", // Open
  "1470071459604-3b5ec3a7fe05", // Still
  "1495616811223-4d98c6e9c869", // Dynamic
  "1509316785289-025f5b846b35", // Ancient
  "1506905925346-21bda4d32df4", // Timeless
  "1519681393784-d120267933ba", // Eternal
  "1518837695005-2083093ee35b", // Infinite
  "1441974231531-c6227db76b6e", // Boundless
  "1501594907352-04cda38ebc29", // Endless
  "1470071459604-3b5ec3a7fe05", // Limitless
  "1495616811223-4d98c6e9c869", // Unending
  "1507003211169-0a1dd7228f2d", // Immense
  "1469474968028-56695f4e46da", // Towering
  "1505142468610-3595f1dcdd23", // Soaring
  "1511593358241-7eea1f3c84e5", // Rising
  "1506905925346-21bda4d32df4", // Ascending
  "1518837695005-2083093ee35b", // Descending
  "1441974231531-c6227db76b6e", // Flowing
  "1501594907352-04cda38ebc29", // Moving
  "1470071459604-3b5ec3a7fe05", // Changing
]

/**
 * Generate a unique Unsplash image URL based on book name
 * Uses hash of book name to consistently select from curated image list
 */
function getUniqueImageUrl(bookName: string, width: number = 800): string {
  // Create a simple hash from book name to get consistent but unique images
  let hash = 0
  for (let i = 0; i < bookName.length; i++) {
    hash = bookName.charCodeAt(i) + ((hash << 5) - hash)
  }
  // Use hash to select from curated image list
  const imageId = unsplashImageIds[Math.abs(hash) % unsplashImageIds.length]
  return `https://images.unsplash.com/photo-${imageId}?w=${width}&q=80&auto=format&fit=crop`
}

// Visual presets mapped by book name
// Using diverse Unsplash images that relate to themes, nature, landscapes, etc.
export const bookVisuals: Record<string, BookVisual> = {
  // Old Testament - Pentateuch
  "Genesis": {
    gradient: "from-amber-700 via-orange-800 to-red-900",
    overlay: "bg-gradient-to-br from-amber-700/50 via-orange-800/40 to-red-900/50",
    moodColor: "amber",
    imageUrl: getUniqueImageUrl("Genesis"),
    textColor: "text-white",
  },
  "Exodus": {
    gradient: "from-yellow-600 via-amber-700 to-orange-800",
    overlay: "bg-gradient-to-br from-yellow-600/50 via-amber-700/40 to-orange-800/50",
    moodColor: "yellow",
    imageUrl: getUniqueImageUrl("Exodus"),
    textColor: "text-white",
  },
  "Leviticus": {
    gradient: "from-red-700 via-rose-800 to-pink-900",
    overlay: "bg-gradient-to-br from-red-700/50 via-rose-800/40 to-pink-900/50",
    moodColor: "red",
    imageUrl: getUniqueImageUrl("Leviticus"),
    textColor: "text-white",
  },
  "Numbers": {
    gradient: "from-indigo-700 via-purple-800 to-violet-900",
    overlay: "bg-gradient-to-br from-indigo-700/50 via-purple-800/40 to-violet-900/50",
    moodColor: "indigo",
    imageUrl: getUniqueImageUrl("Numbers"),
    textColor: "text-white",
  },
  "Deuteronomy": {
    gradient: "from-teal-700 via-cyan-800 to-blue-900",
    overlay: "bg-gradient-to-br from-teal-700/50 via-cyan-800/40 to-blue-900/50",
    moodColor: "teal",
    imageUrl: getUniqueImageUrl("Deuteronomy"),
    textColor: "text-white",
  },
  // Historical Books
  "Joshua": {
    gradient: "from-green-700 via-emerald-800 to-teal-900",
    overlay: "bg-gradient-to-br from-green-700/50 via-emerald-800/40 to-teal-900/50",
    moodColor: "green",
    imageUrl: getUniqueImageUrl("Joshua"),
    textColor: "text-white",
  },
  "Judges": {
    gradient: "from-slate-700 via-gray-800 to-zinc-900",
    overlay: "bg-gradient-to-br from-slate-700/50 via-gray-800/40 to-zinc-900/50",
    moodColor: "slate",
    imageUrl: getUniqueImageUrl("Judges"),
    textColor: "text-white",
  },
  "Ruth": {
    gradient: "from-pink-600 via-rose-700 to-red-800",
    overlay: "bg-gradient-to-br from-pink-600/50 via-rose-700/40 to-red-800/50",
    moodColor: "pink",
    imageUrl: getUniqueImageUrl("Ruth"),
    textColor: "text-white",
  },
  "1 Samuel": {
    gradient: "from-blue-700 via-indigo-800 to-purple-900",
    overlay: "bg-gradient-to-br from-blue-700/50 via-indigo-800/40 to-purple-900/50",
    moodColor: "blue",
    imageUrl: getUniqueImageUrl("1 Samuel"),
    textColor: "text-white",
  },
  "2 Samuel": {
    gradient: "from-blue-600 via-cyan-700 to-teal-800",
    overlay: "bg-gradient-to-br from-blue-600/50 via-cyan-700/40 to-teal-800/50",
    moodColor: "blue",
    imageUrl: getUniqueImageUrl("2 Samuel"),
    textColor: "text-white",
  },
  "1 Kings": {
    gradient: "from-amber-600 via-yellow-700 to-orange-800",
    overlay: "bg-gradient-to-br from-amber-600/50 via-yellow-700/40 to-orange-800/50",
    moodColor: "amber",
    imageUrl: getUniqueImageUrl("1 Kings"),
    textColor: "text-white",
  },
  "2 Kings": {
    gradient: "from-orange-600 via-amber-700 to-yellow-800",
    overlay: "bg-gradient-to-br from-orange-600/50 via-amber-700/40 to-yellow-800/50",
    moodColor: "orange",
    imageUrl: getUniqueImageUrl("2 Kings"),
    textColor: "text-white",
  },
  "1 Chronicles": {
    gradient: "from-purple-700 via-violet-800 to-fuchsia-900",
    overlay: "bg-gradient-to-br from-purple-700/50 via-violet-800/40 to-fuchsia-900/50",
    moodColor: "purple",
    imageUrl: getUniqueImageUrl("Numbers"),
    textColor: "text-white",
  },
  "2 Chronicles": {
    gradient: "from-violet-700 via-purple-800 to-indigo-900",
    overlay: "bg-gradient-to-br from-violet-700/50 via-purple-800/40 to-indigo-900/50",
    moodColor: "violet",
    imageUrl: getUniqueImageUrl("Deuteronomy"),
    textColor: "text-white",
  },
  "Ezra": {
    gradient: "from-emerald-700 via-teal-800 to-cyan-900",
    overlay: "bg-gradient-to-br from-emerald-700/50 via-teal-800/40 to-cyan-900/50",
    moodColor: "emerald",
    imageUrl: getUniqueImageUrl("Joshua"),
    textColor: "text-white",
  },
  "Nehemiah": {
    gradient: "from-teal-700 via-emerald-800 to-green-900",
    overlay: "bg-gradient-to-br from-teal-700/50 via-emerald-800/40 to-green-900/50",
    moodColor: "teal",
    imageUrl: getUniqueImageUrl("Judges"),
    textColor: "text-white",
  },
  "Esther": {
    gradient: "from-rose-600 via-pink-700 to-fuchsia-800",
    overlay: "bg-gradient-to-br from-rose-600/50 via-pink-700/40 to-fuchsia-800/50",
    moodColor: "rose",
    imageUrl: getUniqueImageUrl("Leviticus"),
    textColor: "text-white",
  },
  // Wisdom/Poetry Books
  "Job": {
    gradient: "from-slate-800 via-gray-900 to-zinc-950",
    overlay: "bg-gradient-to-br from-slate-800/50 via-gray-900/40 to-zinc-950/50",
    moodColor: "slate",
    imageUrl: getUniqueImageUrl("Judges"),
    textColor: "text-white",
  },
  "Psalm": {
    gradient: "from-blue-600 via-indigo-700 to-purple-800",
    overlay: "bg-gradient-to-br from-blue-600/50 via-indigo-700/40 to-purple-800/50",
    moodColor: "blue",
    imageUrl: getUniqueImageUrl("1 Samuel"),
    textColor: "text-white",
  },
  "Proverbs": {
    gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    overlay: "bg-gradient-to-br from-emerald-600/50 via-teal-700/40 to-cyan-800/50",
    moodColor: "emerald",
    imageUrl: getUniqueImageUrl("Deuteronomy"),
    textColor: "text-white",
  },
  "Ecclesiastes": {
    gradient: "from-amber-700 via-orange-800 to-red-900",
    overlay: "bg-gradient-to-br from-amber-700/50 via-orange-800/40 to-red-900/50",
    moodColor: "amber",
    imageUrl: getUniqueImageUrl("1 Kings"),
    textColor: "text-white",
  },
  "Song of Solomon": {
    gradient: "from-pink-600 via-rose-700 to-red-800",
    overlay: "bg-gradient-to-br from-pink-600/50 via-rose-700/40 to-red-800/50",
    moodColor: "pink",
    imageUrl: getUniqueImageUrl("Leviticus"),
    textColor: "text-white",
  },
  // Major Prophets
  "Isaiah": {
    gradient: "from-indigo-700 via-blue-800 to-cyan-900",
    overlay: "bg-gradient-to-br from-indigo-700/50 via-blue-800/40 to-cyan-900/50",
    moodColor: "indigo",
    imageUrl: getUniqueImageUrl("1 Samuel"),
    textColor: "text-white",
  },
  "Jeremiah": {
    gradient: "from-violet-700 via-purple-800 to-fuchsia-900",
    overlay: "bg-gradient-to-br from-violet-700/50 via-purple-800/40 to-fuchsia-900/50",
    moodColor: "violet",
    imageUrl: getUniqueImageUrl("Exodus"),
    textColor: "text-white",
  },
  "Lamentations": {
    gradient: "from-gray-700 via-slate-800 to-zinc-900",
    overlay: "bg-gradient-to-br from-gray-700/50 via-slate-800/40 to-zinc-900/50",
    moodColor: "gray",
    imageUrl: getUniqueImageUrl("Judges"),
    textColor: "text-white",
  },
  "Ezekiel": {
    gradient: "from-cyan-700 via-blue-800 to-indigo-900",
    overlay: "bg-gradient-to-br from-cyan-700/50 via-blue-800/40 to-indigo-900/50",
    moodColor: "cyan",
    imageUrl: getUniqueImageUrl("Numbers"),
    textColor: "text-white",
  },
  "Daniel": {
    gradient: "from-amber-600 via-yellow-700 to-orange-800",
    overlay: "bg-gradient-to-br from-amber-600/50 via-yellow-700/40 to-orange-800/50",
    moodColor: "amber",
    imageUrl: getUniqueImageUrl("Deuteronomy"),
    textColor: "text-white",
  },
  // Minor Prophets
  "Hosea": {
    gradient: "from-red-600 via-rose-700 to-pink-800",
    overlay: "bg-gradient-to-br from-red-600/50 via-rose-700/40 to-pink-800/50",
    moodColor: "red",
    imageUrl: getUniqueImageUrl("Leviticus"),
    textColor: "text-white",
  },
  "Joel": {
    gradient: "from-orange-600 via-amber-700 to-yellow-800",
    overlay: "bg-gradient-to-br from-orange-600/50 via-amber-700/40 to-yellow-800/50",
    moodColor: "orange",
    imageUrl: getUniqueImageUrl("1 Samuel"),
    textColor: "text-white",
  },
  "Amos": {
    gradient: "from-emerald-600 via-green-700 to-teal-800",
    overlay: "bg-gradient-to-br from-emerald-600/50 via-green-700/40 to-teal-800/50",
    moodColor: "emerald",
    imageUrl: getUniqueImageUrl("Joshua"),
    textColor: "text-white",
  },
  "Obadiah": {
    gradient: "from-slate-600 via-gray-700 to-zinc-800",
    overlay: "bg-gradient-to-br from-slate-600/50 via-gray-700/40 to-zinc-800/50",
    moodColor: "slate",
    imageUrl: getUniqueImageUrl("Judges"),
    textColor: "text-white",
  },
  "Jonah": {
    gradient: "from-blue-600 via-cyan-700 to-teal-800",
    overlay: "bg-gradient-to-br from-blue-600/50 via-cyan-700/40 to-teal-800/50",
    moodColor: "blue",
    imageUrl: getUniqueImageUrl("Exodus"),
    textColor: "text-white",
  },
  "Micah": {
    gradient: "from-purple-600 via-violet-700 to-fuchsia-800",
    overlay: "bg-gradient-to-br from-purple-600/50 via-violet-700/40 to-fuchsia-800/50",
    moodColor: "purple",
    imageUrl: getUniqueImageUrl("Numbers"),
    textColor: "text-white",
  },
  "Nahum": {
    gradient: "from-red-700 via-orange-800 to-amber-900",
    overlay: "bg-gradient-to-br from-red-700/50 via-orange-800/40 to-amber-900/50",
    moodColor: "red",
    imageUrl: getUniqueImageUrl("1 Samuel"),
    textColor: "text-white",
  },
  "Habakkuk": {
    gradient: "from-indigo-600 via-blue-700 to-cyan-800",
    overlay: "bg-gradient-to-br from-indigo-600/50 via-blue-700/40 to-cyan-800/50",
    moodColor: "indigo",
    imageUrl: getUniqueImageUrl("Deuteronomy"),
    textColor: "text-white",
  },
  "Zephaniah": {
    gradient: "from-violet-600 via-purple-700 to-pink-800",
    overlay: "bg-gradient-to-br from-violet-600/50 via-purple-700/40 to-pink-800/50",
    moodColor: "violet",
    imageUrl: getUniqueImageUrl("1 Kings"),
    textColor: "text-white",
  },
  "Haggai": {
    gradient: "from-amber-600 via-yellow-700 to-orange-800",
    overlay: "bg-gradient-to-br from-amber-600/50 via-yellow-700/40 to-orange-800/50",
    moodColor: "amber",
    imageUrl: getUniqueImageUrl("Exodus"),
    textColor: "text-white",
  },
  "Zechariah": {
    gradient: "from-teal-600 via-emerald-700 to-green-800",
    overlay: "bg-gradient-to-br from-teal-600/50 via-emerald-700/40 to-green-800/50",
    moodColor: "teal",
    imageUrl: getUniqueImageUrl("Joshua"),
    textColor: "text-white",
  },
  "Malachi": {
    gradient: "from-orange-700 via-red-800 to-rose-900",
    overlay: "bg-gradient-to-br from-orange-700/50 via-red-800/40 to-rose-900/50",
    moodColor: "orange",
    imageUrl: getUniqueImageUrl("Judges"),
    textColor: "text-white",
  },
  // New Testament - Gospels
  "Matthew": {
    gradient: "from-blue-500 via-indigo-600 to-purple-700",
    overlay: "bg-gradient-to-br from-blue-500/50 via-indigo-600/40 to-purple-700/50",
    moodColor: "blue",
    imageUrl: getUniqueImageUrl("1 Samuel"),
    textColor: "text-white",
  },
  "Mark": {
    gradient: "from-red-500 via-rose-600 to-pink-700",
    overlay: "bg-gradient-to-br from-red-500/50 via-rose-600/40 to-pink-700/50",
    moodColor: "red",
    imageUrl: getUniqueImageUrl("Exodus"),
    textColor: "text-white",
  },
  "Luke": {
    gradient: "from-green-500 via-emerald-600 to-teal-700",
    overlay: "bg-gradient-to-br from-green-500/50 via-emerald-600/40 to-teal-700/50",
    moodColor: "green",
    imageUrl: getUniqueImageUrl("Deuteronomy"),
    textColor: "text-white",
  },
  "John": {
    gradient: "from-purple-500 via-violet-600 to-indigo-700",
    overlay: "bg-gradient-to-br from-purple-500/50 via-violet-600/40 to-indigo-700/50",
    moodColor: "purple",
    imageUrl: getUniqueImageUrl("Numbers"),
    textColor: "text-white",
  },
  // Acts and Epistles
  "Acts": {
    gradient: "from-cyan-500 via-blue-600 to-indigo-700",
    overlay: "bg-gradient-to-br from-cyan-500/50 via-blue-600/40 to-indigo-700/50",
    moodColor: "cyan",
    imageUrl: getUniqueImageUrl("1 Samuel"),
    textColor: "text-white",
  },
  "Romans": {
    gradient: "from-indigo-500 via-purple-600 to-violet-700",
    overlay: "bg-gradient-to-br from-indigo-500/50 via-purple-600/40 to-violet-700/50",
    moodColor: "indigo",
    imageUrl: getUniqueImageUrl("Exodus"),
    textColor: "text-white",
  },
  "1 Corinthians": {
    gradient: "from-blue-500 via-cyan-600 to-teal-700",
    overlay: "bg-gradient-to-br from-blue-500/50 via-cyan-600/40 to-teal-700/50",
    moodColor: "blue",
    imageUrl: getUniqueImageUrl("Deuteronomy"),
    textColor: "text-white",
  },
  "2 Corinthians": {
    gradient: "from-cyan-500 via-teal-600 to-emerald-700",
    overlay: "bg-gradient-to-br from-cyan-500/50 via-teal-600/40 to-emerald-700/50",
    moodColor: "cyan",
    imageUrl: getUniqueImageUrl("Joshua"),
    textColor: "text-white",
  },
  "Galatians": {
    gradient: "from-purple-500 via-fuchsia-600 to-pink-700",
    overlay: "bg-gradient-to-br from-purple-500/50 via-fuchsia-600/40 to-pink-700/50",
    moodColor: "purple",
    imageUrl: getUniqueImageUrl("Leviticus"),
    textColor: "text-white",
  },
  "Ephesians": {
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    overlay: "bg-gradient-to-br from-violet-500/50 via-purple-600/40 to-indigo-700/50",
    moodColor: "violet",
    imageUrl: getUniqueImageUrl("Judges"),
    textColor: "text-white",
  },
  "Philippians": {
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    overlay: "bg-gradient-to-br from-emerald-500/50 via-teal-600/40 to-cyan-700/50",
    moodColor: "emerald",
    imageUrl: getUniqueImageUrl("1 Kings"),
    textColor: "text-white",
  },
  "Colossians": {
    gradient: "from-teal-500 via-emerald-600 to-green-700",
    overlay: "bg-gradient-to-br from-teal-500/50 via-emerald-600/40 to-green-700/50",
    moodColor: "teal",
    imageUrl: getUniqueImageUrl("1 Samuel"),
    textColor: "text-white",
  },
  "1 Thessalonians": {
    gradient: "from-blue-500 via-indigo-600 to-purple-700",
    overlay: "bg-gradient-to-br from-blue-500/50 via-indigo-600/40 to-purple-700/50",
    moodColor: "blue",
    imageUrl: getUniqueImageUrl("Exodus"),
    textColor: "text-white",
  },
  "2 Thessalonians": {
    gradient: "from-indigo-500 via-blue-600 to-cyan-700",
    overlay: "bg-gradient-to-br from-indigo-500/50 via-blue-600/40 to-cyan-700/50",
    moodColor: "indigo",
    imageUrl: getUniqueImageUrl("Deuteronomy"),
    textColor: "text-white",
  },
  "1 Timothy": {
    gradient: "from-amber-500 via-yellow-600 to-orange-700",
    overlay: "bg-gradient-to-br from-amber-500/50 via-yellow-600/40 to-orange-700/50",
    moodColor: "amber",
    imageUrl: getUniqueImageUrl("Joshua"),
    textColor: "text-white",
  },
  "2 Timothy": {
    gradient: "from-orange-500 via-amber-600 to-yellow-700",
    overlay: "bg-gradient-to-br from-orange-500/50 via-amber-600/40 to-yellow-700/50",
    moodColor: "orange",
    imageUrl: getUniqueImageUrl("Judges"),
    textColor: "text-white",
  },
  "Titus": {
    gradient: "from-rose-500 via-pink-600 to-fuchsia-700",
    overlay: "bg-gradient-to-br from-rose-500/50 via-pink-600/40 to-fuchsia-700/50",
    moodColor: "rose",
    imageUrl: getUniqueImageUrl("Leviticus"),
    textColor: "text-white",
  },
  "Philemon": {
    gradient: "from-slate-500 via-gray-600 to-zinc-700",
    overlay: "bg-gradient-to-br from-slate-500/50 via-gray-600/40 to-zinc-700/50",
    moodColor: "slate",
    imageUrl: getUniqueImageUrl("1 Samuel"),
    textColor: "text-white",
  },
  "Hebrews": {
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    overlay: "bg-gradient-to-br from-violet-500/50 via-purple-600/40 to-indigo-700/50",
    moodColor: "violet",
    imageUrl: getUniqueImageUrl("Numbers"),
    textColor: "text-white",
  },
  "James": {
    gradient: "from-emerald-500 via-green-600 to-teal-700",
    overlay: "bg-gradient-to-br from-emerald-500/50 via-green-600/40 to-teal-700/50",
    moodColor: "emerald",
    imageUrl: getUniqueImageUrl("Deuteronomy"),
    textColor: "text-white",
  },
  "1 Peter": {
    gradient: "from-blue-500 via-cyan-600 to-teal-700",
    overlay: "bg-gradient-to-br from-blue-500/50 via-cyan-600/40 to-teal-700/50",
    moodColor: "blue",
    imageUrl: getUniqueImageUrl("1 Kings"),
    textColor: "text-white",
  },
  "2 Peter": {
    gradient: "from-cyan-500 via-blue-600 to-indigo-700",
    overlay: "bg-gradient-to-br from-cyan-500/50 via-blue-600/40 to-indigo-700/50",
    moodColor: "cyan",
    imageUrl: getUniqueImageUrl("Exodus"),
    textColor: "text-white",
  },
  "1 John": {
    gradient: "from-purple-500 via-violet-600 to-fuchsia-700",
    overlay: "bg-gradient-to-br from-purple-500/50 via-violet-600/40 to-fuchsia-700/50",
    moodColor: "purple",
    imageUrl: getUniqueImageUrl("Joshua"),
    textColor: "text-white",
  },
  "2 John": {
    gradient: "from-fuchsia-500 via-pink-600 to-rose-700",
    overlay: "bg-gradient-to-br from-fuchsia-500/50 via-pink-600/40 to-rose-700/50",
    moodColor: "fuchsia",
    imageUrl: getUniqueImageUrl("Judges"),
    textColor: "text-white",
  },
  "3 John": {
    gradient: "from-pink-500 via-rose-600 to-red-700",
    overlay: "bg-gradient-to-br from-pink-500/50 via-rose-600/40 to-red-700/50",
    moodColor: "pink",
    imageUrl: getUniqueImageUrl("3 John"),
    textColor: "text-white",
  },
  "Jude": {
    gradient: "from-slate-500 via-gray-600 to-zinc-700",
    overlay: "bg-gradient-to-br from-slate-500/50 via-gray-600/40 to-zinc-700/50",
    moodColor: "slate",
    imageUrl: getUniqueImageUrl("Jude"),
    textColor: "text-white",
  },
  "Revelation": {
    gradient: "from-purple-700 via-indigo-800 to-blue-900",
    overlay: "bg-gradient-to-br from-purple-700/50 via-indigo-800/40 to-blue-900/50",
    moodColor: "purple",
    imageUrl: getUniqueImageUrl("Revelation"),
    textColor: "text-white",
  },
}

/**
 * Get visual preset for a book
 * Falls back to a default gradient if not found
 */
export function getBookVisual(bookName: string): BookVisual {
  if (bookVisuals[bookName]) {
    // Ensure each book gets a unique image even if not in the preset list
    return {
      ...bookVisuals[bookName],
      imageUrl: bookVisuals[bookName].imageUrl || getUniqueImageUrl(bookName),
    }
  }
  // Default fallback with unique image
  return {
    gradient: "from-slate-500 via-slate-600 to-slate-700",
    overlay: "bg-gradient-to-br from-slate-500/40 via-slate-600/30 to-slate-700/40",
    moodColor: "slate",
    imageUrl: getUniqueImageUrl(bookName),
    textColor: "text-white",
  }
}

