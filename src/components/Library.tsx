import React, { useState } from 'react';
import type { StudySet, Folder } from '../types';
import { Folder as FolderIcon, Plus, Trash2, Layers, ChevronRight } from 'lucide-react';

interface LibraryProps {
  sets: StudySet[];
  folders: Folder[];
  onSelectSet: (set: StudySet) => void;
  onOpenCreateSet: () => void;
  onOpenCreateFolder: () => void;
  onDeleteFolder: (folderId: string) => void;
  onDeleteSet: (setId: string) => void;
}

export const Library: React.FC<LibraryProps> = ({
  sets,
  folders,
  onSelectSet,
  onOpenCreateSet,
  onOpenCreateFolder,
  onDeleteFolder,
  onDeleteSet
}) => {
  const [activeTab, setActiveTab] = useState<'sets' | 'folders'>('sets');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  const folderSets = selectedFolder
    ? sets.filter(s => s.folderId === selectedFolder.id || selectedFolder.setIds.includes(s.id))
    : [];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">

      {/* Library Title & Tab Switching */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Your Library</h1>
          <p className="text-xs text-slate-500 mt-1">Manage all your created flashcard sets and study folders</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => { setActiveTab('sets'); setSelectedFolderId(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'sets' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Study Sets ({sets.length})
            </button>
            <button
              onClick={() => setActiveTab('folders')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'folders' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Folders ({folders.length})
            </button>
          </div>

          <button
            onClick={activeTab === 'sets' ? onOpenCreateSet : onOpenCreateFolder}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create {activeTab === 'sets' ? 'Set' : 'Folder'}</span>
          </button>
        </div>
      </div>

      {/* Sets View */}
      {activeTab === 'sets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sets.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No study sets created yet</h3>
              <p className="text-xs text-slate-500 mt-1">Start by creating your first set of flashcards.</p>
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
                className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-xs">
                      {set.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete study set "${set.title}"?`)) {
                          onDeleteSet(set.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Set"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {set.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {set.description || 'No description'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{set.terms.length} terms</span>
                  <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">
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
            /* Selected Folder Detail View */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedFolderId(null)}
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                ← Back to All Folders
              </button>

              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-1">
                    <FolderIcon className="w-5 h-5" />
                    Folder
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedFolder.name}</h2>
                  {selectedFolder.description && (
                    <p className="text-xs text-slate-500 mt-1">{selectedFolder.description}</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete folder "${selectedFolder.name}"?`)) {
                      onDeleteFolder(selectedFolder.id);
                      setSelectedFolderId(null);
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Folder
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {folderSets.length === 0 ? (
                  <div className="col-span-full bg-white p-8 rounded-2xl border border-dashed text-center text-xs text-slate-500">
                    No sets added to this folder yet. Edit a set and choose this folder to organize it here!
                  </div>
                ) : (
                  folderSets.map(set => (
                    <div
                      key={set.id}
                      onClick={() => onSelectSet(set)}
                      className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
                    >
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-xs">
                        {set.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2 line-clamp-1">{set.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{set.terms.length} terms</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Folder Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {folders.length === 0 ? (
                <div className="col-span-full bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                  <FolderIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No study folders yet</h3>
                  <p className="text-xs text-slate-500 mt-1">Folders help organize sets by subject or course.</p>
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
                    className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FolderIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{f.name}</h3>
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

    </div>
  );
};
