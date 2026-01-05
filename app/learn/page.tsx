"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Clock, BookOpen, TrendingUp, Sparkles, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePlayer } from "@/lib/player-store"
import type { Playlist } from "@/lib/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function LearnPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const player = usePlayer()

  useEffect(() => {
    fetch("/api/playlists")
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data)
        setIsLoading(false)
      })
      .catch(console.error)
  }, [])

  // Get continue section (last played)
  const continuePlaylist = player.currentPlaylist
  const continueTrack = player.currentTrack

  // Get recently played
  const recentlyPlayed = player.history
    .slice(-5)
    .reverse()
    .map((h) => {
      const playlist = playlists.find((p) => p.id === h.playlistId)
      const track = playlist?.tracks.find((t) => t.id === h.trackId)
      return { playlist, track, playedAt: h.playedAt }
    })
    .filter((item) => item.track)

  // Made for beginners
  const beginnerPlaylists = playlists.filter((p) => p.difficulty === "Beginner")

  // Popular (most tracks)
  const popularPlaylists = [...playlists].sort((a, b) => b.tracks.length - a.tracks.length).slice(0, 4)

  const handlePlay = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      player.playTrack(playlist.tracks[0].id, playlist.id)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-6">
      {/* Hero Section - Warm, reassuring introduction */}
      <div className="relative">
        {/* Subtle background glow for warmth */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl blur-xl opacity-50" />
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2">Good morning</h1>
          <p className="text-muted-foreground mb-2">
            Ready to learn? Pick up where you left off or start something new.
          </p>
          {/* Reassurance sentence - plain language, non-preachy */}
          <p className="text-sm text-muted-foreground/80">
            Take your time. There's no right or wrong way to begin.
          </p>
        </div>
      </div>

      {/* Continue Section */}
      {continuePlaylist && continueTrack && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Continue</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/playlist/${continuePlaylist.id}`}>Show all</Link>
            </Button>
          </div>
          <Card className="group cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => player.playTrack(continueTrack.id, continuePlaylist.id)}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`h-16 w-16 rounded-lg bg-gradient-to-br ${continuePlaylist.coverGradient || "from-primary to-primary/50"} flex items-center justify-center shrink-0`}
                >
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{continueTrack.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {continuePlaylist.title} • {continueTrack.reference}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${player.progress * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(player.progress * 100)}%
                    </span>
                  </div>
                </div>
                <Button size="icon" variant="default" className="shrink-0">
                  <Play className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Start Here Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Start Here</h2>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {playlists
              .filter((p) => p.id === "start-here")
              .map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} onPlay={handlePlay} />
              ))}
          </div>
        )}
      </section>

      {/* Made for Beginners */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Made for Beginners</h2>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {beginnerPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} onPlay={handlePlay} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
          <div className="space-y-2">
            {recentlyPlayed.map((item, idx) => (
              <Card
                key={idx}
                className="group cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => item.track && item.playlist && player.playTrack(item.track.id, item.playlist.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.track?.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.playlist?.title} • {item.track?.reference}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" className="shrink-0">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Popular Playlists */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Popular Playlists</h2>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {popularPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} onPlay={handlePlay} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function PlaylistCard({
  playlist,
  onPlay,
}: {
  playlist: Playlist
  onPlay: (playlist: Playlist) => void
}) {
  return (
    <Card className="group cursor-pointer hover:bg-accent/50 transition-all">
      <Link href={`/playlist/${playlist.id}`}>
        <div
          className={`h-48 rounded-t-lg bg-gradient-to-br ${playlist.coverGradient || "from-primary to-primary/50"} flex items-center justify-center`}
        >
          <BookOpen className="h-16 w-16 text-white/80" />
        </div>
      </Link>
      <CardHeader className="pb-3">
        <Link href={`/playlist/${playlist.id}`}>
          <CardTitle className="line-clamp-1 group-hover:underline">{playlist.title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-1">{playlist.description}</CardDescription>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {/* Beginner badge with helpful tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {playlist.difficulty}
                    </Badge>
                    {playlist.difficulty === "Beginner" && (
                      <HelpCircle className="h-3 w-3 text-muted-foreground/60" />
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
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {playlist.totalDuration} min
            </span>
          </div>
          <Button
            size="sm"
            variant="default"
            className="h-8 w-8 rounded-full p-0"
            onClick={(e) => {
              e.preventDefault()
              onPlay(playlist)
            }}
          >
            <Play className="h-4 w-4 ml-0.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

