import React, { useState, useEffect } from 'react';
import type { StudySet, Folder, UserStats, StudyClass } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SetEditor } from './components/SetEditor';
import { SetDetail } from './components/SetDetail';
import { Library } from './components/Library';
import { AIAssistant } from './components/AIAssistant';
import { ExpertSolutions } from './components/ExpertSolutions';
import {
  getStoredSets,
  saveStoredSets,
  getStoredFolders,
  saveStoredFolders,
  getStoredClasses,
  saveStoredClasses,
  getStoredStats,
  saveStoredStats
} from './storage';

export function App() {
  const [sets, setSets] = useState<StudySet[]>(getStoredSets);
  const [folders, setFolders] = useState<Folder[]>(getStoredFolders);
  const [classes, setClasses] = useState<StudyClass[]>(getStoredClasses);
  const [stats, setStats] = useState<UserStats>(getStoredStats);

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSet, setSelectedSet] = useState<StudySet | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('quizlinq_dark_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('quizlinq_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSelectSet = (set: StudySet) => {
    setSelectedSet(set);
    setActiveView('set-detail');
  };

  const handleOpenCreateSet = () => {
    setSelectedSet(null);
    setActiveView('create-set');
  };

  const handleSaveSet = (savedSet: StudySet) => {
    const existingIndex = sets.findIndex(s => s.id === savedSet.id);
    let updatedSets: StudySet[];

    if (existingIndex >= 0) {
      updatedSets = [...sets];
      updatedSets[existingIndex] = savedSet;
    } else {
      updatedSets = [savedSet, ...sets];
    }

    setSets(updatedSets);
    saveStoredSets(updatedSets);

    setSelectedSet(savedSet);
    setActiveView('set-detail');
  };

  const handleDeleteSet = (setId: string) => {
    const updatedSets = sets.filter(s => s.id !== setId);
    setSets(updatedSets);
    saveStoredSets(updatedSets);

    if (selectedSet?.id === setId) {
      setSelectedSet(null);
      setActiveView('dashboard');
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    const updatedFolders = folders.filter(f => f.id !== folderId);
    setFolders(updatedFolders);
    saveStoredFolders(updatedFolders);
  };

  const handleDeleteClass = (classId: string) => {
    const updatedClasses = classes.filter(c => c.id !== classId);
    setClasses(updatedClasses);
    saveStoredClasses(updatedClasses);
  };

  const handleTermStarToggle = (termId: string) => {
    if (!selectedSet) return;

    const updatedTerms = selectedSet.terms.map(t =>
      t.id === termId ? { ...t, starred: !t.starred } : t
    );

    const updatedSet = { ...selectedSet, terms: updatedTerms };
    setSelectedSet(updatedSet);

    const updatedSets = sets.map(s => (s.id === selectedSet.id ? updatedSet : s));
    setSets(updatedSets);
    saveStoredSets(updatedSets);
  };

  const handleStatsUpdate = (masteredDelta: number) => {
    const updatedStats: UserStats = {
      ...stats,
      setsStudiedCount: stats.setsStudiedCount + 1,
      termsMasteredCount: stats.termsMasteredCount + masteredDelta,
      lastStudiedDate: new Date().toISOString().split('T')[0]
    };
    setStats(updatedStats);
    saveStoredStats(updatedStats);
  };

  const handleOpenCreateFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim()) {
      const newFolder: Folder = {
        id: 'folder-' + Date.now(),
        name: folderName.trim(),
        createdAt: Date.now(),
        setIds: []
      };
      const updatedFolders = [...folders, newFolder];
      setFolders(updatedFolders);
      saveStoredFolders(updatedFolders);
      alert(`Folder "${folderName}" created successfully!`);
    }
  };

  const handleOpenCreateClass = () => {
    const className = prompt('Enter class or study group name:');
    if (className && className.trim()) {
      const schoolName = prompt('Enter school or university name (optional):') || 'QuizLinq Community';
      const newClass: StudyClass = {
        id: 'class-' + Date.now(),
        name: className.trim(),
        schoolName: schoolName.trim(),
        joinCode: 'QL-' + Math.floor(100 + Math.random() * 900),
        memberCount: 1,
        setIds: sets.length > 0 ? [sets[0].id] : []
      };
      const updatedClasses = [...classes, newClass];
      setClasses(updatedClasses);
      saveStoredClasses(updatedClasses);
      alert(`Class "${className}" created! Join Code: ${newClass.joinCode}`);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenCreateSet={handleOpenCreateSet}
        onOpenCreateFolder={handleOpenCreateFolder}
        stats={stats}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'dashboard' && (
          <Dashboard
            sets={sets}
            folders={folders}
            stats={stats}
            searchQuery={searchQuery}
            onSelectSet={handleSelectSet}
            onOpenCreateSet={handleOpenCreateSet}
            onOpenCreateFolder={handleOpenCreateFolder}
            onNavigateToAI={() => setActiveView('ai-assistant')}
            onSelectCategory={(cat) => setSearchQuery(cat)}
          />
        )}

        {activeView === 'library' && (
          <Library
            sets={sets}
            folders={folders}
            classes={classes}
            onSelectSet={handleSelectSet}
            onOpenCreateSet={handleOpenCreateSet}
            onOpenCreateFolder={handleOpenCreateFolder}
            onOpenCreateClass={handleOpenCreateClass}
            onDeleteFolder={handleDeleteFolder}
            onDeleteSet={handleDeleteSet}
            onDeleteClass={handleDeleteClass}
          />
        )}

        {activeView === 'expert-solutions' && (
          <ExpertSolutions />
        )}

        {activeView === 'ai-assistant' && (
          <AIAssistant
            onSaveNewSet={(newSet) => {
              const updatedSets = [newSet, ...sets];
              setSets(updatedSets);
              saveStoredSets(updatedSets);
            }}
          />
        )}

        {activeView === 'set-detail' && selectedSet && (
          <SetDetail
            set={selectedSet}
            folders={folders}
            onBack={() => setActiveView('dashboard')}
            onEdit={() => setActiveView('edit-set')}
            onTermStarToggle={handleTermStarToggle}
            onStatsUpdate={handleStatsUpdate}
          />
        )}

        {(activeView === 'create-set' || activeView === 'edit-set') && (
          <SetEditor
            initialSet={activeView === 'edit-set' ? selectedSet : null}
            folders={folders}
            onSave={handleSaveSet}
            onCancel={() => {
              if (selectedSet) {
                setActiveView('set-detail');
              } else {
                setActiveView('dashboard');
              }
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
