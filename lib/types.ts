export interface TrendData {
  default: {
    timelineData: Array<{
      time: string
      formattedTime?: string
      formattedAxisTime?: string
      value: number[]
    }>
    averages?: number[]
  }
}

// Bible Learning Types
export interface Verse {
  book: string
  chapter: number
  verse: number
  text: string
}

export interface Quiz {
  question: string
  choices: string[]
  answerIndex: number
  explanation: string
}

export interface Lesson {
  lifeSituation?: string // "When does this show up in real life?"
  summary: string
  keyIdea: string
  behavioralTakeaway?: string // "Because this is true → do this differently today"
  reflectionQuestion: string
  quiz?: Quiz
}

export interface Track {
  id: string
  playlistId: string
  title: string
  reference: string
  estimatedMinutes: number
  verses: Verse[]
  lesson: Lesson
}

export interface Playlist {
  id: string
  title: string
  description: string
  coverGradient?: string
  coverImage?: string
  difficulty: string
  totalDuration: number
  tags: string[]
  tracks: Track[]
  wrapUp?: string // End-of-playlist integration message
}

export interface PlayerState {
  currentTrackId: string | null
  currentPlaylistId: string | null
  isPlaying: boolean
  progress: number // 0-1
  history: Array<{
    trackId: string
    playlistId: string
    playedAt: string
  }>
  playbackSpeed: number
}
