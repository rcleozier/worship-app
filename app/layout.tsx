import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppShell } from "@/components/app-shell"
import { PlayerProvider } from "@/lib/player-store"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bible Learning - Guided Lessons for Beginners",
  description: "Learn the Bible through guided playlists, lessons, and beginner-friendly content",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <PlayerProvider>
          <AppShell>{children}</AppShell>
        </PlayerProvider>
      </body>
    </html>
  )
}

