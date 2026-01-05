"use client"

import { AppSidebar } from "./app-sidebar"
import { AppTopbar } from "./app-topbar"
import { NowPlayingBar } from "./now-playing-bar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto bg-background pb-20">
          {children}
        </main>
        <NowPlayingBar />
      </div>
    </div>
  )
}

