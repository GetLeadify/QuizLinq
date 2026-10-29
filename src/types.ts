export interface Term {
  id: string;
  term: string;
  definition: string;
  starred?: boolean;
  image?: string;
}

export interface StudySet {
  id: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  terms: Term[];
  createdAt: number;
  updatedAt: number;
  author: {
    name: string;
    avatar: string;
  };
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  setIds: string[];
}

export interface StudyClass {
  id: string;
  name: string;
  schoolName: string;
  joinCode: string;
  memberCount: number;
  setIds: string[];
}

export interface UserStats {
  setsStudiedCount: number;
  termsMasteredCount: number;
  streakDays: number;
  lastStudiedDate: string;
  matchGameHighScores: Record<string, number>;
}

export const INITIAL_CLASSES: StudyClass[] = [
  {
    id: 'class-1',
    name: 'AP Computer Science A - Fall 2026',
    schoolName: 'Lincoln High School',
    joinCode: 'QL-CS-892',
    memberCount: 28,
    setIds: ['set-cs-1']
  },
  {
    id: 'class-2',
    name: 'Spanish 101 Intensive',
    schoolName: 'State University',
    joinCode: 'QL-ESP-101',
    memberCount: 15,
    setIds: ['set-span-1']
  }
];

export const INITIAL_SETS: StudySet[] = [
  {
    id: 'set-geo-1',
    title: 'World Capitals & Geography Highlights',
    description: 'Master major national capitals and key geographical facts around the globe.',
    category: 'Geography',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    },
    terms: [
      { id: 't1', term: 'Japan', definition: 'Tokyo' },
      { id: 't2', term: 'Australia', definition: 'Canberra' },
      { id: 't3', term: 'Canada', definition: 'Ottawa' },
      { id: 't4', term: 'Brazil', definition: 'Brasília' },
      { id: 't5', term: 'Egypt', definition: 'Cairo' },
      { id: 't6', term: 'Longest River in the World', definition: 'The Nile River (~6,650 km)' },
      { id: 't7', term: 'Highest Mountain Peak', definition: 'Mount Everest (8,848.86m)' },
      { id: 't8', term: 'Largest Desert', definition: 'Antarctic Desert (Cold) / Sahara (Hot)' },
    ]
  },
  {
    id: 'set-cs-1',
    title: 'Data Structures & Algorithms Basics',
    description: 'Core Big-O time complexities, fundamental data structures, and algorithmic paradigms.',
    category: 'Computer Science',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
    author: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    terms: [
      { id: 't10', term: 'Array Access by Index', definition: 'O(1) Constant Time' },
      { id: 't11', term: 'Binary Search Time Complexity', definition: 'O(log n)' },
      { id: 't12', term: 'Stack Data Structure', definition: 'Last-In, First-Out (LIFO)' },
      { id: 't13', term: 'Queue Data Structure', definition: 'First-In, First-Out (FIFO)' },
      { id: 't14', term: 'Hash Table Average Lookup', definition: 'O(1) Constant Time' },
      { id: 't15', term: 'QuickSort Worst-Case Complexity', definition: 'O(n²)' },
      { id: 't16', term: 'Dijkstra\'s Algorithm', definition: 'Finds the shortest path between nodes in a graph with non-negative edge weights.' },
      { id: 't17', term: 'Recursion', definition: 'A method where the solution depends on solutions to smaller instances of the same problem.' },
    ]
  },
  {
    id: 'set-span-1',
    title: 'Spanish Essential Conversational Phrases',
    description: 'Must-know conversational vocabulary and phrases for travel and daily dialogue.',
    category: 'Languages',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    author: {
      name: 'Sofia Gomez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    terms: [
      { id: 't20', term: 'How are you?', definition: '¿Cómo estás?' },
      { id: 't21', term: 'Nice to meet you', definition: 'Mucho gusto' },
      { id: 't22', term: 'Where is the bathroom?', definition: '¿Dónde está el baño?' },
      { id: 't23', term: 'How much does it cost?', definition: '¿Cuánto cuesta?' },
      { id: 't24', term: 'I don\'t understand', definition: 'No entiendo' },
      { id: 't25', term: 'Please / Thank you', definition: 'Por favor / Gracias' },
      { id: 't26', term: 'See you later', definition: 'Hasta luego' },
    ]
  },
  {
    id: 'set-med-1',
    title: 'Human Anatomy & Physiology Terminology',
    description: 'Key organ systems, medical directional terms, and cell physiology basics.',
    category: 'Biology & Medicine',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    author: {
      name: 'Dr. Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
    terms: [
      { id: 't30', term: 'Mitochondria', definition: 'Powerhouse of the cell, produces ATP energy' },
      { id: 't31', term: 'Homeostasis', definition: 'State of steady internal physical and chemical conditions maintained by living systems' },
      { id: 't32', term: 'Anterior / Ventral', definition: 'Toward the front of the body' },
      { id: 't33', term: 'Posterior / Dorsal', definition: 'Toward the back of the body' },
      { id: 't34', term: 'Hemoglobin', definition: 'Iron-containing protein in red blood cells that transports oxygen' },
      { id: 't35', term: 'Central Nervous System (CNS)', definition: 'Consists of the brain and spinal cord' },
    ]
  }
];

export const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'folder-1',
    name: 'General Science & Tech',
    description: 'Core concepts in CS and Biology',
    createdAt: Date.now() - 86400000 * 4,
    setIds: ['set-cs-1', 'set-med-1']
  }
];
