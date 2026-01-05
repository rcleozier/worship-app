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
import { getPlaylistVisual } from "@/lib/playlist-visuals"

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
    <div className="flex flex-1 flex-col gap-14 p-6 md:p-8 bg-gradient-to-b from-background via-background to-background/95">
      {/* Hero Section - Enhanced with background image and better visual hierarchy */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-8 md:p-12">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 bg-clip-text text-transparent">
              Good morning
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 mb-3 font-medium">
              Ready to learn? Pick up where you left off or start something new.
            </p>
            {/* Reassurance sentence - plain language, non-preachy */}
            <p className="text-base text-foreground/70">
              Take your time. There's no right or wrong way to begin.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Section - Enhanced with visual identity and accent */}
      {continuePlaylist && continueTrack && (
        <section className="relative">
          {/* Subtle background depth with calm blue tones */}
          <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/3 via-indigo-500/2 to-transparent rounded-2xl -z-10" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              {/* Section header with calm blue accent */}
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Continue
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/playlist/${continuePlaylist.id}`}>Show all</Link>
              </Button>
            </div>
            <Card 
              className="group cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden border-0 shadow-md bg-card/50 backdrop-blur-sm"
              style={{ borderRadius: "1.25rem" }}
              onClick={() => player.playTrack(continueTrack.id, continuePlaylist.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <ContinuePlaylistCover playlist={continuePlaylist} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{continueTrack.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {continuePlaylist.title} • {continueTrack.reference}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all rounded-full"
                          style={{ width: `${player.progress * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(player.progress * 100)}%
                      </span>
                    </div>
                  </div>
                  <Button size="icon" variant="default" className="shrink-0 shadow-md hover:shadow-lg transition-shadow">
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Start Here Section - Featured with special treatment and warm accent */}
      <section className="relative">
        {/* Enhanced background depth with warm glow for section separation */}
        <div className="absolute -inset-6 bg-gradient-to-br from-amber-500/5 via-orange-500/3 to-rose-500/2 rounded-3xl -z-10 blur-sm" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            {/* Section header with warm accent color */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
              Start Here
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 dark:text-amber-400 font-medium border border-amber-500/30 backdrop-blur-sm">
              Recommended
            </span>
          </div>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {playlists
                .filter((p) => p.id === "start-here")
                .map((playlist) => (
                  <PlaylistCard 
                    key={playlist.id} 
                    playlist={playlist} 
                    onPlay={handlePlay}
                    featured={true}
                  />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Made for Beginners - Visual separation with soft background and accent */}
      <section className="relative pt-4">
        {/* Subtle background depth with calm green tones */}
        <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/3 via-teal-500/2 to-transparent rounded-2xl -z-10" />
        <div className="relative">
          {/* Section header with calm green accent */}
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Made for Beginners
          </h2>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {beginnerPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} onPlay={handlePlay} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recently Played - Enhanced with visual covers */}
      {recentlyPlayed.length > 0 && (
        <section className="relative pt-4">
          {/* Subtle background depth */}
          <div className="absolute -inset-4 bg-gradient-to-br from-slate-500/2 via-slate-600/1 to-transparent rounded-2xl -z-10" />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">
              Recently Played
            </h2>
            <div className="space-y-3">
              {recentlyPlayed.map((item, idx) => {
                const visual = item.playlist ? getPlaylistVisual(item.playlist.id, item.playlist.tags) : null
                return (
                  <Card
                    key={idx}
                    className="group cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-0 shadow-md overflow-hidden"
                    style={{ borderRadius: "1rem" }}
                    onClick={() => item.track && item.playlist && player.playTrack(item.track.id, item.playlist.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Playlist cover thumbnail */}
                        {visual && (
                          <div
                            className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 shadow-md"
                            style={{
                              backgroundImage: visual.imageUrl 
                                ? `url('${visual.imageUrl}')` 
                                : visual.bgImage,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} opacity-85`} />
                          </div>
                        )}
                        {!visual && (
                          <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center shrink-0 shadow-md">
                            <BookOpen className="h-7 w-7 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{item.track?.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {item.playlist?.title} • {item.track?.reference}
                          </p>
                        </div>
                        <Button size="icon" variant="ghost" className="shrink-0 hover:bg-primary/10">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Popular Playlists - Visual separation with accent */}
      <section className="relative pt-4">
        {/* Subtle background depth with contemplative purple tones */}
        <div className="absolute -inset-4 bg-gradient-to-br from-violet-500/3 via-purple-500/2 to-transparent rounded-2xl -z-10" />
        <div className="relative">
          {/* Section header with contemplative purple accent */}
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
            Popular Playlists
          </h2>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {popularPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} onPlay={handlePlay} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Helper component for Continue section cover with image support
function ContinuePlaylistCover({ playlist }: { playlist: Playlist }) {
  const visual = getPlaylistVisual(playlist.id, playlist.tags)
  return (
    <div
      className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 shadow-lg"
      style={{
        backgroundImage: visual.imageUrl 
          ? `url('${visual.imageUrl}')` 
          : visual.bgImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} opacity-85`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  )
}

function PlaylistCard({
  playlist,
  onPlay,
  featured = false,
}: {
  playlist: Playlist
  onPlay: (playlist: Playlist) => void
  featured?: boolean
}) {
  const visual = getPlaylistVisual(playlist.id, playlist.tags)
  
  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 ${
        featured 
          ? "hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1.5 border-0 shadow-lg shadow-amber-500/5" 
          : "hover:shadow-xl hover:-translate-y-0.5 border-0 shadow-md"
      } overflow-hidden bg-card/50 backdrop-blur-sm`}
      style={{
        borderRadius: "1.25rem", // Increased for more warmth and softness
        boxShadow: featured 
          ? "0 10px 40px -10px rgba(251, 191, 36, 0.15), 0 0 0 1px rgba(251, 191, 36, 0.1)" 
          : "0 4px 20px -4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Link href={`/playlist/${playlist.id}`}>
        {/* Enhanced cover with actual images and rich visual treatment */}
        <div
          className={`relative overflow-hidden ${featured ? "h-64" : "h-52"}`}
          style={{
            backgroundImage: visual.imageUrl 
              ? `url('${visual.imageUrl}')` 
              : visual.bgImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient overlay for mood and text contrast - rich and warm */}
          <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} ${featured ? "opacity-75" : "opacity-80"}`} />
          
          {/* Additional depth overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          
          {/* Decorative light element - larger and more prominent for featured */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${featured ? "w-80 h-80" : "w-56 h-56"} rounded-full ${visual.overlay} blur-3xl ${featured ? "opacity-30" : "opacity-25"}`} />
          </div>
          
          {/* Featured glow effect for Start Here */}
          {featured && (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/15 via-orange-500/8 to-transparent" />
          )}
        </div>
      </Link>
      
      <CardHeader className="pb-4 px-5 pt-5">
        <Link href={`/playlist/${playlist.id}`}>
          <CardTitle className={`line-clamp-1 group-hover:underline ${featured ? "text-xl font-bold" : "text-base font-semibold"}`}>
            {playlist.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 mt-2 text-sm leading-relaxed">
            {playlist.description}
          </CardDescription>
        </Link>
      </CardHeader>
      
      <CardContent className="pt-0 px-5 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            {/* Beginner badge with helpful tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-muted/50"
                    >
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
            className={`h-9 w-9 rounded-full p-0 shadow-lg hover:shadow-xl transition-all ${
              featured 
                ? "bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 ring-2 ring-amber-500/30" 
                : "bg-primary hover:bg-primary/90"
            }`}
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

