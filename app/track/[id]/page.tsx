"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown, ChevronUp, Play, CheckCircle2, Circle, BookOpen } from "lucide-react"
import { usePlayer } from "@/lib/player-store"
import type { Track, Playlist } from "@/lib/types"

export default function TrackPage() {
  const params = useParams()
  const router = useRouter()
  const trackId = params.id as string
  const [track, setTrack] = useState<Track | null>(null)
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showContext, setShowContext] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null)
  const [showQuizExplanation, setShowQuizExplanation] = useState(false)
  const player = usePlayer()

  useEffect(() => {
    fetch("/api/playlists")
      .then((res) => res.json())
      .then((data: Playlist[]) => {
        for (const p of data) {
          const found = p.tracks.find((t) => t.id === trackId)
          if (found) {
            setTrack(found)
            setPlaylist(p)
            break
          }
        }
        setIsLoading(false)
      })
      .catch(console.error)
  }, [trackId])

  const handlePlay = () => {
    if (track && playlist) {
      player.playTrack(track.id, playlist.id)
    }
  }

  const handleQuizSubmit = (answerIndex: number) => {
    setQuizAnswer(answerIndex)
    setShowQuizExplanation(true)
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!track || !playlist) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-2">Track not found</h2>
        <Button onClick={() => router.push("/learn")}>Go to Home</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">{playlist.title}</Badge>
            <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
            <p className="text-muted-foreground">{track.reference}</p>
          </div>
          <Button onClick={handlePlay} size="lg">
            <Play className="mr-2 h-5 w-5" />
            {player.currentTrackId === track.id && player.isPlaying ? "Playing" : "Play"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Verses */}
        <Card>
          <CardHeader>
            <CardTitle>Bible Verses</CardTitle>
            <CardDescription>{track.reference}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {track.verses.map((verse, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-semibold text-primary min-w-[3rem] shrink-0">
                    {verse.verse}
                  </span>
                  <p className="text-base leading-relaxed flex-1">{verse.text}</p>
                </div>
              </div>
            ))}

            {/* Show Context Toggle */}
            <div className="pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContext(!showContext)}
                className="w-full"
              >
                {showContext ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Hide Context
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Show Context (3 verses before and after)
                  </>
                )}
              </Button>
              {showContext && (
                <div className="mt-4 p-4 rounded-lg bg-muted text-sm text-muted-foreground">
                  Context verses would load here. This feature shows surrounding verses to help
                  understand the passage better.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: Beginner Lesson */}
        <Card>
          <CardHeader>
            <CardTitle>Beginner Lesson</CardTitle>
            <CardDescription>Learn what this passage means</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* In Plain English */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                In Plain English
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {track.lesson.summary}
              </p>
            </div>

            {/* Key Idea */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h3 className="text-sm font-semibold mb-2">Key Idea</h3>
              <p className="text-sm leading-relaxed">{track.lesson.keyIdea}</p>
            </div>

            {/* Reflection Question */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Reflection</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                {track.lesson.reflectionQuestion}
              </p>
              <div className="p-3 rounded-lg bg-muted text-sm italic">
                Take a moment to think about this question. There's no right or wrong answer - it's
                about what this verse means to you.
              </div>
            </div>

            {/* Quiz */}
            {track.lesson.quiz && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Quick Check</h3>
                <div className="space-y-3">
                  <p className="text-sm font-medium">{track.lesson.quiz.question}</p>
                  <div className="space-y-2">
                    {track.lesson.quiz.choices.map((choice, idx) => (
                      <Button
                        key={idx}
                        variant={
                          quizAnswer === idx
                            ? idx === track.lesson.quiz!.answerIndex
                              ? "default"
                              : "destructive"
                            : "outline"
                        }
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => handleQuizSubmit(idx)}
                        disabled={showQuizExplanation}
                      >
                        <div className="flex items-center gap-2">
                          {showQuizExplanation && (
                            <>
                              {idx === track.lesson.quiz!.answerIndex ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                              ) : quizAnswer === idx ? (
                                <Circle className="h-4 w-4 shrink-0" />
                              ) : null}
                            </>
                          )}
                          <span className="text-sm">{choice}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                  {showQuizExplanation && (
                    <div className="p-3 rounded-lg bg-muted text-sm">
                      <p className="font-medium mb-1">Explanation:</p>
                      <p className="text-muted-foreground">{track.lesson.quiz.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

