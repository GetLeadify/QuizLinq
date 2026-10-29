import type { StudySet, Folder, StudyClass, UserStats } from './types';
import { INITIAL_SETS, INITIAL_FOLDERS, INITIAL_CLASSES } from './types';
import { AP_SCIENCE_SETS } from './data/apScienceData';
import { MEDICAL_SETS } from './data/medicalData';

const SETS_KEY = 'quizlinq_sets_v1';
const FOLDERS_KEY = 'quizlinq_folders_v1';
const CLASSES_KEY = 'quizlinq_classes_v1';
const STATS_KEY = 'quizlinq_stats_v1';

const ALL_DEFAULT_SETS = [...INITIAL_SETS, ...AP_SCIENCE_SETS, ...MEDICAL_SETS];

export function getStoredSets(): StudySet[] {
  try {
    const data = localStorage.getItem(SETS_KEY);
    if (!data) {
      localStorage.setItem(SETS_KEY, JSON.stringify(ALL_DEFAULT_SETS));
      return ALL_DEFAULT_SETS;
    }
    return JSON.parse(data);
  } catch {
    return ALL_DEFAULT_SETS;
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

export function getStoredClasses(): StudyClass[] {
  try {
    const data = localStorage.getItem(CLASSES_KEY);
    if (!data) {
      localStorage.setItem(CLASSES_KEY, JSON.stringify(INITIAL_CLASSES));
      return INITIAL_CLASSES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CLASSES;
  }
}

export function saveStoredClasses(classes: StudyClass[]): void {
  try {
    localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
  } catch (err) {
    console.error('Failed to save classes to localStorage', err);
  }
}

export function getStoredStats(): UserStats {
  const defaultStats: UserStats = {
    setsStudiedCount: 16,
    termsMasteredCount: 64,
    streakDays: 5,
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
