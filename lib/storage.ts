// Local storage utilities for projects and saved items

export interface Project {
  id: string
  name: string
  createdAt: string
  keywords: string[]
  savedTrends: string[]
}

export interface SavedTrend {
  id: string
  query: string
  savedAt: string
  projectId?: string
}

export interface Quota {
  trendViews: number
  aiGenerations: number
  lastReset: string
}

const STORAGE_KEYS = {
  projects: "trendstream_projects",
  currentProject: "trendstream_current_project",
  savedTrends: "trendstream_saved_trends",
  quota: "trendstream_quota",
}

export function getProjects(): Project[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.projects)
  return data ? JSON.parse(data) : [{ id: "default", name: "Default Project", createdAt: new Date().toISOString(), keywords: [], savedTrends: [] }]
}

export function saveProject(project: Project): void {
  if (typeof window === "undefined") return
  const projects = getProjects()
  const existing = projects.findIndex((p) => p.id === project.id)
  if (existing >= 0) {
    projects[existing] = project
  } else {
    projects.push(project)
  }
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects))
}

export function getCurrentProjectId(): string {
  if (typeof window === "undefined") return "default"
  return localStorage.getItem(STORAGE_KEYS.currentProject) || "default"
}

export function setCurrentProject(projectId: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.currentProject, projectId)
}

export function getSavedTrends(): SavedTrend[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.savedTrends)
  return data ? JSON.parse(data) : []
}

export function saveTrend(trend: SavedTrend): void {
  if (typeof window === "undefined") return
  const trends = getSavedTrends()
  if (!trends.find((t) => t.id === trend.id)) {
    trends.push(trend)
    localStorage.setItem(STORAGE_KEYS.savedTrends, JSON.stringify(trends))
  }
}

export function removeSavedTrend(trendId: string): void {
  if (typeof window === "undefined") return
  const trends = getSavedTrends()
  const filtered = trends.filter((t) => t.id !== trendId)
  localStorage.setItem(STORAGE_KEYS.savedTrends, JSON.stringify(filtered))
}

export function getQuota(): Quota {
  if (typeof window === "undefined") {
    return { trendViews: 10, aiGenerations: 5, lastReset: new Date().toISOString() }
  }
  const data = localStorage.getItem(STORAGE_KEYS.quota)
  const quota = data ? JSON.parse(data) : { trendViews: 10, aiGenerations: 5, lastReset: new Date().toISOString() }
  
  // Reset daily
  const lastReset = new Date(quota.lastReset)
  const now = new Date()
  if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    return { trendViews: 10, aiGenerations: 5, lastReset: now.toISOString() }
  }
  
  return quota
}

export function useQuota(type: "trendViews" | "aiGenerations"): boolean {
  if (typeof window === "undefined") return false
  const quota = getQuota()
  if (quota[type] <= 0) return false
  quota[type]--
  localStorage.setItem(STORAGE_KEYS.quota, JSON.stringify(quota))
  return true
}

