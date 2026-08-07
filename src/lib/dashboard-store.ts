export interface DashboardPreferencesV1 {
  version: 1;
  pinnedToolIds: string[];
  recentToolIds: string[];
}

export const DASHBOARD_STORAGE_KEY = 'shadtools.dashboard.v1';

export function getDashboardState(): DashboardPreferencesV1 | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DASHBOARD_STORAGE_KEY);
    if (!raw) return null;
    const parsed: DashboardPreferencesV1 = JSON.parse(raw);
    if (parsed && parsed.version === 1 && Array.isArray(parsed.pinnedToolIds)) {
      return parsed;
    }
  } catch {
    // Return null on corrupt data or storage error
  }
  return null;
}

export function saveDashboardState(pinned: string[], recents: string[]) {
  if (typeof window === 'undefined') return;
  try {
    const state: DashboardPreferencesV1 = {
      version: 1,
      pinnedToolIds: pinned,
      recentToolIds: recents,
    };
    localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Handle storage quota or exception
  }
}

export function recordRecentTool(toolId: string) {
  if (typeof window === 'undefined' || !toolId) return;
  const current = getDashboardState();
  const currentPins = current?.pinnedToolIds || [];
  const currentRecents = current?.recentToolIds || [];

  // Deduplicate and place toolId at the start (up to 8 recents)
  const updatedRecents = [toolId, ...currentRecents.filter((id) => id !== toolId)].slice(0, 8);
  saveDashboardState(currentPins, updatedRecents);
}
