import type { StudySet, Folder, UserStats } from './types';
import { INITIAL_SETS, INITIAL_FOLDERS } from './types';

const SETS_KEY = 'quizlinq_sets_v1';
const FOLDERS_KEY = 'quizlinq_folders_v1';
const STATS_KEY = 'quizlinq_stats_v1';

export function getStoredSets(): StudySet[] {
  try {
    const data = localStorage.getItem(SETS_KEY);
    if (!data) {
      localStorage.setItem(SETS_KEY, JSON.stringify(INITIAL_SETS));
      return INITIAL_SETS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_SETS;
  }
}

export function saveStoredSets(sets: StudySet[]): void {
  try {
    localStorage.setItem(SETS_KEY, JSON.stringify(sets));
  } catch (err) {
    console.error('Failed to save sets to localStorage', err);
  }
}

export function getStoredFolders(): Folder[] {
  try {
    const data = localStorage.getItem(FOLDERS_KEY);
    if (!data) {
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(INITIAL_FOLDERS));
      return INITIAL_FOLDERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_FOLDERS;
  }
}

export function saveStoredFolders(folders: Folder[]): void {
  try {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  } catch (err) {
    console.error('Failed to save folders to localStorage', err);
  }
}

export function getStoredStats(): UserStats {
  const defaultStats: UserStats = {
    setsStudiedCount: 12,
    termsMasteredCount: 48,
    streakDays: 4,
    lastStudiedDate: new Date().toISOString().split('T')[0],
    matchGameHighScores: {},
  };

  try {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) {
      localStorage.setItem(STATS_KEY, JSON.stringify(defaultStats));
      return defaultStats;
    }
    return JSON.parse(data);
  } catch {
    return defaultStats;
  }
}

export function saveStoredStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats to localStorage', err);
  }
}
