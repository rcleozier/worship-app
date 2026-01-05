"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import type { PlayerState, Track, Playlist } from "@/lib/types"
import { ttsService } from "@/lib/tts"

interface PlayerContextType extends PlayerState {
  playTrack: (trackId: string, playlistId: string) => void
  togglePlay: () => void
  nextTrack: () => void
  prevTrack: () => void
  seek: (progress: number) => void
  setPlaybackSpeed: (speed: number) => void
  currentTrack: Track | null
  currentPlaylist: Playlist | null
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bible_player_state")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          // Fallback to default
        }
      }
    }
    return {
      currentTrackId: null,
      currentPlaylistId: null,
      isPlaying: false,
      progress: 0,
      history: [],
      playbackSpeed: 1,
    }
  })

  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const ttsProgressRef = useRef<number>(0)

  // Load playlists
  useEffect(() => {
    fetch("/api/playlists")
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch(console.error)
  }, [])

  // Get current track and playlist
  const currentTrack = playlists
    .flatMap((p) => p.tracks)
    .find((t) => t.id === state.currentTrackId) || null

  const currentPlaylist = playlists.find((p) => p.id === state.currentPlaylistId) || null

  // Persist state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bible_player_state", JSON.stringify(state))
    }
  }, [state])

  // Text-to-Speech integration
  useEffect(() => {
    if (!currentTrack) {
      ttsService.cancel()
      return
    }

    const isCurrentlySpeaking = ttsService.getIsSpeaking()
    const isCurrentlyPaused = ttsService.getIsPaused()

    // When play is toggled or track changes
    if (state.isPlaying) {
      if (!isCurrentlySpeaking && !isCurrentlyPaused) {
        // Start new TTS - read naturally like a story
        // Read reference once at the start, then flow verse text naturally without repetition
        const referenceText = `${currentTrack.reference}.`
        
        // Join all verse texts naturally, removing extra periods and creating smooth flow
        const verseTexts = currentTrack.verses
          .map((v) => {
            // Remove trailing periods from verse text to avoid double periods
            return v.text.trim().replace(/\.$/, "")
          })
          .join(". ")
        
        // Combine reference and verses with natural flow - like reading a story
        const fullText = `${referenceText} ${verseTexts}.`

        ttsService.speak(
          fullText,
          {
            rate: state.playbackSpeed,
            pitch: 1,
            volume: 1,
          },
          {
            onProgress: (progress) => {
              ttsProgressRef.current = progress
              setState((prev) => ({ ...prev, progress }))
            },
            onComplete: () => {
              // Auto-advance to next track
              setState((prev) => {
                const playlist = playlists.find((p) => p.id === prev.currentPlaylistId)
                if (playlist) {
                  const currentIndex = playlist.tracks.findIndex((t) => t.id === prev.currentTrackId)
                  if (currentIndex < playlist.tracks.length - 1) {
                    const nextTrack = playlist.tracks[currentIndex + 1]
                    return {
                      ...prev,
                      currentTrackId: nextTrack.id,
                      progress: 0,
                      isPlaying: true, // Auto-play next
                      history: [
                        ...prev.history,
                        {
                          trackId: prev.currentTrackId!,
                          playlistId: prev.currentPlaylistId!,
                          playedAt: new Date().toISOString(),
                        },
                      ],
                    }
                  }
                }
                return { ...prev, isPlaying: false, progress: 1 }
              })
            },
          }
        )
      } else if (isCurrentlyPaused) {
        // Resume paused TTS
        ttsService.resume()
      }
    } else {
      // Pause TTS when play is stopped
      if (isCurrentlySpeaking) {
        ttsService.pause()
      }
    }

    // Cleanup on track change
    return () => {
      // Only cancel if track actually changed
      if (currentTrack && state.currentTrackId !== currentTrack.id) {
        ttsService.cancel()
      }
    }
  }, [state.isPlaying, state.currentTrackId, currentTrack, playlists, state.currentPlaylistId])

  // Update TTS speed when playback speed changes (restart from beginning for simplicity)
  useEffect(() => {
    if (ttsService.getIsSpeaking() && currentTrack && state.isPlaying) {
      // Cancel and restart with new speed
      ttsService.cancel()
      
      // Restart from beginning with new speed - natural story flow
      const referenceText = `${currentTrack.reference}.`
      const verseTexts = currentTrack.verses
        .map((v) => {
          // Remove trailing periods from verse text to avoid double periods
          return v.text.trim().replace(/\.$/, "")
        })
        .join(". ")
      const fullText = `${referenceText} ${verseTexts}.`
      
      ttsService.speak(
        fullText,
        {
          rate: state.playbackSpeed,
          pitch: 1,
          volume: 1,
        },
        {
          onProgress: (progress) => {
            ttsProgressRef.current = progress
            setState((prev) => ({ ...prev, progress }))
          },
          onComplete: () => {
            // Auto-advance logic
            setState((prev) => {
              const playlist = playlists.find((p) => p.id === prev.currentPlaylistId)
              if (playlist) {
                const currentIndex = playlist.tracks.findIndex((t) => t.id === prev.currentTrackId)
                if (currentIndex < playlist.tracks.length - 1) {
                  const nextTrack = playlist.tracks[currentIndex + 1]
                  return {
                    ...prev,
                    currentTrackId: nextTrack.id,
                    progress: 0,
                    isPlaying: true,
                    history: [
                      ...prev.history,
                      {
                        trackId: prev.currentTrackId!,
                        playlistId: prev.currentPlaylistId!,
                        playedAt: new Date().toISOString(),
                      },
                    ],
                  }
                }
              }
              return { ...prev, isPlaying: false, progress: 1 }
            })
          },
        }
      )
    }
  }, [state.playbackSpeed, currentTrack, state.isPlaying, playlists, state.currentPlaylistId, state.currentTrackId])

  const playTrack = useCallback((trackId: string, playlistId: string) => {
    // Cancel any existing TTS
    ttsService.cancel()
    setState((prev) => ({
      ...prev,
      currentTrackId: trackId,
      currentPlaylistId: playlistId,
      isPlaying: true,
      progress: 0,
    }))
  }, [])

  const togglePlay = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
  }, [])

  const nextTrack = useCallback(() => {
    ttsService.cancel()
    setState((prev) => {
      if (!prev.currentPlaylistId) return prev
      const playlist = playlists.find((p) => p.id === prev.currentPlaylistId)
      if (!playlist || !prev.currentTrackId) return prev

      const currentIndex = playlist.tracks.findIndex((t) => t.id === prev.currentTrackId)
      if (currentIndex < playlist.tracks.length - 1) {
        const nextTrack = playlist.tracks[currentIndex + 1]
        return {
          ...prev,
          currentTrackId: nextTrack.id,
          progress: 0,
          isPlaying: prev.isPlaying, // Maintain play state
          history: [
            ...prev.history,
            {
              trackId: prev.currentTrackId,
              playlistId: prev.currentPlaylistId,
              playedAt: new Date().toISOString(),
            },
          ],
        }
      }
      return prev
    })
  }, [playlists])

  const prevTrack = useCallback(() => {
    ttsService.cancel()
    setState((prev) => {
      if (!prev.currentPlaylistId) return prev
      const playlist = playlists.find((p) => p.id === prev.currentPlaylistId)
      if (!playlist || !prev.currentTrackId) return prev

      const currentIndex = playlist.tracks.findIndex((t) => t.id === prev.currentTrackId)
      if (currentIndex > 0) {
        const prevTrack = playlist.tracks[currentIndex - 1]
        return {
          ...prev,
          currentTrackId: prevTrack.id,
          progress: 0,
          isPlaying: prev.isPlaying, // Maintain play state
        }
      }
      return prev
    })
  }, [playlists])

  const seek = useCallback((progress: number) => {
    const newProgress = Math.max(0, Math.min(1, progress))
    setState((prev) => {
      const wasPlaying = prev.isPlaying
      // Cancel and restart TTS if playing
      if (wasPlaying && prev.currentTrackId) {
        ttsService.cancel()
        // TTS will restart automatically via the useEffect with new progress
      }
      return { ...prev, progress: newProgress }
    })
  }, [])

  const setPlaybackSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, playbackSpeed: speed }))
  }, [])

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setPlaybackSpeed,
        currentTrack,
        currentPlaylist,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider")
  }
  return context
}

