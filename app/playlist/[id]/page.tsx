"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Clock, BookOpen, ChevronRight, HelpCircle, BookOpenCheck } from "lucide-react"
import { usePlayer } from "@/lib/player-store"
import type { Playlist, Track } from "@/lib/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function PlaylistPage() {
  const params = useParams()
  const router = useRouter()
  const playlistId = params.id as string
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const player = usePlayer()

  useEffect(() => {
    fetch("/api/playlists")
      .then((res) => res.json())
      .then((data: Playlist[]) => {
        const found = data.find((p) => p.id === playlistId)
        setPlaylist(found || null)
        setIsLoading(false)
      })
      .catch(console.error)
  }, [playlistId])

  const handlePlay = (track: Track) => {
    player.playTrack(track.id, playlistId)
  }

  const handleStartPlaylist = () => {
    if (playlist && playlist.tracks.length > 0) {
      player.playTrack(playlist.tracks[0].id, playlistId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Skeleton className="h-64 w-full" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Playlist not found</h2>
        <Button onClick={() => router.push("/learn")}>Go to Home</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header with Gradient - Warmer, more inviting */}
      <div
        className={`h-80 bg-gradient-to-br ${playlist.coverGradient || "from-primary to-primary/50"} p-6 flex flex-col justify-end relative overflow-hidden`}
      >
        {/* Subtle texture overlay for warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <div className="relative max-w-4xl z-10">
          {/* Beginner badge with helpful tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1.5 mb-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {playlist.difficulty}
                  </Badge>
                  {playlist.difficulty === "Beginner" && (
                    <HelpCircle className="h-4 w-4 text-white/80" />
                  )}
                </div>
              </TooltipTrigger>
              {playlist.difficulty === "Beginner" && (
                <TooltipContent>
                  <p className="max-w-[200px] text-xs">
                    Perfect for first-time readers. No prior Bible knowledge needed.
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <h1 className="text-5xl font-bold mb-2 text-white drop-shadow-lg">{playlist.title}</h1>
          <p className="text-white/90 mb-4 text-lg drop-shadow">{playlist.description}</p>
          <div className="flex items-center gap-4 text-white/80 text-sm mb-6">
            <span>{playlist.tracks.length} lessons</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {playlist.totalDuration} min
            </span>
          </div>
          {/* Primary CTA with expectation text - safe and reversible */}
          <div className="space-y-2">
            <Button size="lg" onClick={handleStartPlaylist} className="w-fit bg-white text-primary hover:bg-white/90 shadow-lg">
              <Play className="mr-2 h-5 w-5" />
              Start Learning
            </Button>
            {/* One-line expectation in human terms */}
            <p className="text-white/80 text-sm">
              You'll read a short passage, then see a simple explanation. You can pause anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Track List - Redesigned as "steps in a journey" */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Your Learning Journey</h2>
          <div className="space-y-2">
            {playlist.tracks.map((track, idx) => {
              const isCurrent = player.currentTrackId === track.id
              const currentTrackIndex = player.currentTrackId 
                ? playlist.tracks.findIndex(t => t.id === player.currentTrackId)
                : -1
              const isNext = currentTrackIndex === -1 && idx === 0
              const isCompleted = currentTrackIndex > idx
              
              // Determine action type based on lesson content
              const hasQuiz = track.lesson.quiz
              const actionLabel = hasQuiz ? "Practice" : "Reflect"
              
              return (
                <Card
                  key={track.id}
                  className={`group cursor-pointer transition-all ${
                    isCurrent 
                      ? "bg-primary/10 border-primary/30 shadow-md" 
                      : isNext
                      ? "bg-accent/30 border-accent/50 shadow-sm"
                      : "hover:bg-accent/50 border-border"
                  }`}
                  onClick={() => handlePlay(track)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Lesson number with journey indicator */}
                      <div className="flex flex-col items-center shrink-0 w-12">
                        {isCompleted ? (
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <BookOpenCheck className="h-4 w-4 text-primary" />
                          </div>
                        ) : (
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            isCurrent 
                              ? "bg-primary text-primary-foreground" 
                              : isNext
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {idx + 1}
                          </div>
                        )}
                        {/* Journey line (except last item) */}
                        {idx < playlist.tracks.length - 1 && (
                          <div className={`h-8 w-0.5 mt-1 ${
                            isCompleted ? "bg-primary/30" : "bg-muted"
                          }`} />
                        )}
                      </div>
                      
                      {/* Lesson info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium truncate ${
                              isCurrent || isNext ? "text-foreground" : "text-foreground/90"
                            }`}>
                              {track.title}
                            </h3>
                            {/* Action label - subtle */}
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              {actionLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Lesson {idx + 1} of {playlist.tracks.length}</span>
                            <span>•</span>
                            <span>{track.reference}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {track.estimatedMinutes} min
                            </span>
                          </div>
                          {/* Next lesson indicator */}
                          {isNext && (
                            <p className="text-xs text-primary mt-1 font-medium">
                              Start here →
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Play button - always visible for clarity */}
                      <Button
                        size="icon"
                        variant={isCurrent ? "default" : "ghost"}
                        className={`shrink-0 ${
                          isCurrent ? "" : "opacity-70 group-hover:opacity-100"
                        } transition-opacity`}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/track/${track.id}`)
                        }}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

