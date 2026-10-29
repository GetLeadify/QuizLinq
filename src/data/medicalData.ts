import type { StudySet } from '../types';

export const MEDICAL_SETS: StudySet[] = [
  {
    id: 'set-mcat-1',
    title: 'MCAT Behavioral Sciences: Psychology & Sociology',
    description: 'High-yield psychology concepts including Piaget stages, Erikson psychosocial development, and neural pathways.',
    category: 'MCAT Prep',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 7,
    author: {
      name: 'Dr. Anita Patel, MD',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80',
    },
    terms: [
      { id: 'mcat-1', term: 'Piaget Sensorimotor Stage (0-2 yrs)', definition: 'Development of object permanence and stranger anxiety' },
      { id: 'mcat-2', term: 'Piaget Preoperational Stage (2-7 yrs)', definition: 'Egocentrism, symbolic thinking, lack of conservation concept' },
      { id: 'mcat-3', term: 'Piaget Concrete Operational Stage (7-11 yrs)', definition: 'Understanding of conservation, logical thinking about concrete events' },
      { id: 'mcat-4', term: 'Piaget Formal Operational Stage (12+ yrs)', definition: 'Abstract logic, hypothetical reasoning, systematic problem solving' },
      { id: 'mcat-5', term: 'Erikson Stage 1: Trust vs. Mistrust', definition: 'Infancy (0-1 yr); hope and security development' },
      { id: 'mcat-6', term: 'Erikson Stage 5: Identity vs. Role Confusion', definition: 'Adolescence (12-18 yrs); fidelity and self-sense formation' },
      { id: 'mcat-7', term: 'Bystander Effect', definition: 'Individuals are less likely to offer help to a victim when other people are present' },
      { id: 'mcat-8', term: 'Groupthink', definition: 'Desire for harmony or conformity in a group leads to an irrational or dysfunctional decision-making outcome' },
      { id: 'mcat-9', term: 'Fundamental Attribution Error', definition: 'Tendency to overestimate internal dispositional factors and underestimate situational influences on others\' behavior' }
    ]
  }
];
