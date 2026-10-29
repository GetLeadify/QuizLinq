import React, { useState } from 'react';
import type { StudySet, Folder, UserStats } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SetEditor } from './components/SetEditor';
import { SetDetail } from './components/SetDetail';
import { Library } from './components/Library';
import { AIAssistant } from './components/AIAssistant';
import {
  getStoredSets,
  saveStoredSets,
  getStoredFolders,
  saveStoredFolders,
  getStoredStats,
  saveStoredStats
} from './storage';

export function App() {
  const [sets, setSets] = useState<StudySet[]>(getStoredSets);
  const [folders, setFolders] = useState<Folder[]>(getStoredFolders);
  const [stats, setStats] = useState<UserStats>(getStoredStats);

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSet, setSelectedSet] = useState<StudySet | null>(null);

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenCreateSet={handleOpenCreateSet}
        onOpenCreateFolder={handleOpenCreateFolder}
        stats={stats}
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
            onSelectSet={handleSelectSet}
            onOpenCreateSet={handleOpenCreateSet}
            onOpenCreateFolder={handleOpenCreateFolder}
            onDeleteFolder={handleDeleteFolder}
            onDeleteSet={handleDeleteSet}
          />
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
