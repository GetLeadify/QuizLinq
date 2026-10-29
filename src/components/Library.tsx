import React, { useState } from 'react';
import type { StudySet, Folder, StudyClass } from '../types';
import { Folder as FolderIcon, Plus, Trash2, Layers, ChevronRight, Users, Key, School } from 'lucide-react';

interface LibraryProps {
  sets: StudySet[];
  folders: Folder[];
  classes: StudyClass[];
  onSelectSet: (set: StudySet) => void;
  onOpenCreateSet: () => void;
  onOpenCreateFolder: () => void;
  onOpenCreateClass: () => void;
  onDeleteFolder: (folderId: string) => void;
  onDeleteSet: (setId: string) => void;
  onDeleteClass: (classId: string) => void;
}

export const Library: React.FC<LibraryProps> = ({
  sets,
  folders,
  classes,
  onSelectSet,
  onOpenCreateSet,
  onOpenCreateFolder,
  onOpenCreateClass,
  onDeleteFolder,
  onDeleteSet,
  onDeleteClass
}) => {
  const [activeTab, setActiveTab] = useState<'sets' | 'folders' | 'classes'>('sets');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const selectedFolder = folders.find(f => f.id === selectedFolderId);
  const selectedClass = classes.find(c => c.id === selectedClassId);

  const folderSets = selectedFolder
    ? sets.filter(s => s.folderId === selectedFolder.id || selectedFolder.setIds.includes(s.id))
    : [];

  const classSets = selectedClass
    ? sets.filter(s => selectedClass.setIds.includes(s.id))
    : [];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">

      {/* Library Title & Tab Switching */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Your Library</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage all your created flashcard sets, folders, and study classes</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => { setActiveTab('sets'); setSelectedFolderId(null); setSelectedClassId(null); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'sets' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Sets ({sets.length})
            </button>
            <button
              onClick={() => { setActiveTab('folders'); setSelectedClassId(null); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'folders' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Folders ({folders.length})
            </button>
            <button
              onClick={() => { setActiveTab('classes'); setSelectedFolderId(null); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'classes' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Classes ({classes.length})
            </button>
          </div>

          <button
            onClick={activeTab === 'sets' ? onOpenCreateSet : activeTab === 'folders' ? onOpenCreateFolder : onOpenCreateClass}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create {activeTab === 'sets' ? 'Set' : activeTab === 'folders' ? 'Folder' : 'Class'}</span>
          </button>
        </div>
      </div>

      {/* Sets View */}
      {activeTab === 'sets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sets.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
              <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No study sets created yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Start by creating your first set of flashcards.</p>
              <button
                onClick={onOpenCreateSet}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl"
              >
                Create Set
              </button>
            </div>
          ) : (
            sets.map(set => (
              <div
                key={set.id}
                onClick={() => onSelectSet(set)}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs">
                      {set.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete study set "${set.title}"?`)) {
                          onDeleteSet(set.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete Set"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {set.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {set.description || 'No description'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
                  <span>{set.terms.length} terms</span>
                  <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Study</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Folders View */}
      {activeTab === 'folders' && (
        <div>
          {selectedFolder ? (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedFolderId(null)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                ← Back to All Folders
              </button>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
                    <FolderIcon className="w-5 h-5" />
                    Folder
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedFolder.name}</h2>
                  {selectedFolder.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedFolder.description}</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete folder "${selectedFolder.name}"?`)) {
                      onDeleteFolder(selectedFolder.id);
                      setSelectedFolderId(null);
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Folder
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {folderSets.length === 0 ? (
                  <div className="col-span-full bg-white dark:bg-slate-800 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                    No sets added to this folder yet.
                  </div>
                ) : (
                  folderSets.map(set => (
                    <div
                      key={set.id}
                      onClick={() => onSelectSet(set)}
                      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
                    >
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs">
                        {set.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 line-clamp-1">{set.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{set.terms.length} terms</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {folders.length === 0 ? (
                <div className="col-span-full bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
                  <FolderIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No study folders yet</h3>
                  <button
                    onClick={onOpenCreateFolder}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl"
                  >
                    Create Folder
                  </button>
                </div>
              ) : (
                folders.map(f => (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FolderIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {sets.filter(s => s.folderId === f.id || f.setIds.includes(s.id)).length} Sets
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Classes View */}
      {activeTab === 'classes' && (
        <div>
          {selectedClass ? (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedClassId(null)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                ← Back to All Classes
              </button>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1">
                    <Users className="w-5 h-5" />
                    Class Group
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedClass.name}</h2>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><School className="w-3.5 h-3.5" /> {selectedClass.schoolName}</span>
                    <span className="flex items-center gap-1"><Key className="w-3.5 h-3.5 text-amber-500" /> Code: <strong className="text-slate-800 dark:text-slate-200">{selectedClass.joinCode}</strong></span>
                    <span>{selectedClass.memberCount} Members</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete class "${selectedClass.name}"?`)) {
                      onDeleteClass(selectedClass.id);
                      setSelectedClassId(null);
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors self-start md:self-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Class
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {classSets.length === 0 ? (
                  <div className="col-span-full bg-white dark:bg-slate-800 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                    No shared study sets in this class group yet.
                  </div>
                ) : (
                  classSets.map(set => (
                    <div
                      key={set.id}
                      onClick={() => onSelectSet(set)}
                      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
                    >
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs">
                        {set.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 line-clamp-1">{set.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{set.terms.length} terms</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {classes.length === 0 ? (
                <div className="col-span-full bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
                  <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No class groups joined yet</h3>
                  <button
                    onClick={onOpenCreateClass}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl"
                  >
                    Create Class Group
                  </button>
                </div>
              ) : (
                classes.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClassId(c.id)}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{c.schoolName} • Code: {c.joinCode}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
