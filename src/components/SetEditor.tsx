import React, { useState } from 'react';
import type { StudySet, Term, Folder } from '../types';
import {
  Plus,
  Trash2,
  Save,
  X,
  FileText,
  ArrowLeft,
  Upload,
  Layers
} from 'lucide-react';

interface SetEditorProps {
  initialSet?: StudySet | null;
  folders: Folder[];
  onSave: (set: StudySet) => void;
  onCancel: () => void;
}

export const SetEditor: React.FC<SetEditorProps> = ({
  initialSet,
  folders,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(initialSet?.title || '');
  const [description, setDescription] = useState(initialSet?.description || '');
  const [category, setCategory] = useState(initialSet?.category || 'General');
  const [folderId, setFolderId] = useState<string>(initialSet?.folderId || '');

  const [terms, setTerms] = useState<Term[]>(
    initialSet?.terms && initialSet.terms.length > 0
      ? initialSet.terms
      : [
          { id: 't-1', term: '', definition: '' },
          { id: 't-2', term: '', definition: '' },
        ]
  );

  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [termDelimiter, setTermDelimiter] = useState('\t'); // tab or comma or dash

  const handleAddTerm = () => {
    setTerms(prev => [
      ...prev,
      { id: 't-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5), term: '', definition: '' }
    ]);
  };

  const handleRemoveTerm = (id: string) => {
    if (terms.length <= 1) {
      alert('A study set must have at least one term.');
      return;
    }
    setTerms(prev => prev.filter(t => t.id !== id));
  };

  const handleTermChange = (id: string, field: 'term' | 'definition', value: string) => {
    setTerms(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleMoveTerm = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === terms.length - 1)) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newTerms = [...terms];
    const temp = newTerms[index];
    newTerms[index] = newTerms[newIndex];
    newTerms[newIndex] = temp;
    setTerms(newTerms);
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;

    const rows = bulkText.split('\n').filter(row => row.trim());
    const importedTerms: Term[] = rows.map((row, idx) => {
      let parts = row.split(termDelimiter);
      if (parts.length < 2 && termDelimiter !== ',') {
        parts = row.split(',');
      }
      if (parts.length < 2 && termDelimiter !== '-') {
        parts = row.split('-');
      }

      const termStr = parts[0]?.trim() || '';
      const defStr = parts.slice(1).join(termDelimiter).trim() || '';

      return {
        id: 't-imported-' + Date.now() + '-' + idx,
        term: termStr,
        definition: defStr
      };
    }).filter(t => t.term || t.definition);

    if (importedTerms.length === 0) {
      alert('Could not parse any terms from the text provided. Please check your delimiters.');
      return;
    }

    const currentValid = terms.filter(t => t.term.trim() || t.definition.trim());
    setTerms([...currentValid, ...importedTerms]);
    setBulkText('');
    setShowBulkImport(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for your study set.');
      return;
    }

    const validTerms = terms.filter(t => t.term.trim() || t.definition.trim());
    if (validTerms.length === 0) {
      alert('Please add at least one term with a definition.');
      return;
    }

    const savedSet: StudySet = {
      id: initialSet?.id || 'set-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'General',
      createdAt: initialSet?.createdAt || Date.now(),
      updatedAt: Date.now(),
      folderId: folderId || undefined,
      author: initialSet?.author || {
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      terms: validTerms
    };

    onSave(savedSet);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6 animate-in fade-in duration-200">

      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowBulkImport(!showBulkImport)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            <Upload className="w-4 h-4 text-indigo-600" />
            Bulk Import
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-200"
          >
            <Save className="w-4 h-4" />
            {initialSet ? 'Save Changes' : 'Create Set'}
          </button>
        </div>
      </div>

      {/* Header Info Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-5">
        <h2 className="text-2xl font-black text-slate-900">
          {initialSet ? 'Edit Study Set' : 'Create a new Study Set'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Organic Chemistry - Reactions & Mechanisms"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Subject / Category
              </label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Chemistry, Spanish, History"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Add to Folder (Optional)
              </label>
              <select
                value={folderId}
                onChange={e => setFolderId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
              >
                <option value="">-- Select Folder --</option>
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add a brief description about what this set covers..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Bulk Import Modal / Box */}
      {showBulkImport && (
        <div className="bg-indigo-50/80 border border-indigo-200 rounded-3xl p-6 shadow-sm space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-indigo-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Import Data (Copy & Paste)
            </h3>
            <button
              onClick={() => setShowBulkImport(false)}
              className="p-1 hover:bg-indigo-100 rounded-lg text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-indigo-800">
            Paste your vocabulary terms below. Each row will form a flashcard card. Use tabs or commas to separate terms from definitions.
          </p>

          <div className="flex gap-4 text-xs font-semibold text-indigo-900">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="delimiter"
                checked={termDelimiter === '\t'}
                onChange={() => setTermDelimiter('\t')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              Tab Separated
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="delimiter"
                checked={termDelimiter === ','}
                onChange={() => setTermDelimiter(',')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              Comma Separated (,)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="delimiter"
                checked={termDelimiter === '-'}
                onChange={() => setTermDelimiter('-')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              Dash Separated (-)
            </label>
          </div>

          <textarea
            rows={6}
            value={bulkText}
            onChange={e => setBulkText(e.target.value)}
            placeholder={`Term 1\tDefinition 1\nTerm 2\tDefinition 2\nTerm 3\tDefinition 3`}
            className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-2xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowBulkImport(false)}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBulkImport}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Add Imported Terms
            </button>
          </div>
        </div>
      )}

      {/* Terms Editor List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Cards ({terms.length})
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            Fill in terms and definitions below
          </span>
        </div>

        {terms.map((term, index) => (
          <div
            key={term.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all hover:border-slate-300 relative group"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 tracking-wider">
                #{index + 1}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveTerm(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  title="Move Up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveTerm(index, 'down')}
                  disabled={index === terms.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  title="Move Down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveTerm(term.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                  title="Delete Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Term
                </label>
                <input
                  type="text"
                  value={term.term}
                  onChange={e => handleTermChange(term.id, 'term', e.target.value)}
                  placeholder="Enter term..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Definition
                </label>
                <textarea
                  rows={2}
                  value={term.definition}
                  onChange={e => handleTermChange(term.id, 'definition', e.target.value)}
                  placeholder="Enter definition..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Card Button */}
        <button
          type="button"
          onClick={handleAddTerm}
          className="w-full py-4 bg-white hover:bg-indigo-50/50 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl text-indigo-600 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-2xs group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Add Card
        </button>
      </div>

    </div>
  );
};
