import type { StudySet } from '../types';

export const AP_SCIENCE_SETS: StudySet[] = [
  {
    id: 'set-ap-bio-1',
    title: 'AP Biology: Cellular Respiration & Metabolism',
    description: 'Comprehensive review of Glycolysis, Pyruvate Oxidation, Krebs Cycle, and Oxidative Phosphorylation.',
    category: 'AP Biology',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 10,
    author: {
      name: 'Dr. Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    terms: [
      { id: 'apb-1', term: 'Glycolysis Location', definition: 'Cytosol (Cytoplasm) of the cell' },
      { id: 'apb-2', term: 'Glycolysis Net Yield', definition: '2 ATP, 2 NADH, and 2 Pyruvate molecules per glucose' },
      { id: 'apb-3', term: 'Substrate-Level Phosphorylation', definition: 'Direct synthesis of ATP by transferring a phosphate group to ADP from a intermediate substrate' },
      { id: 'apb-4', term: 'Pyruvate Oxidation Product', definition: 'Acetyl-CoA, CO2, and NADH' },
      { id: 'apb-5', term: 'Krebs Cycle Location', definition: 'Mitochondrial Matrix' },
      { id: 'apb-6', term: 'Krebs Cycle Net Yield per Glucose', definition: '2 ATP, 6 NADH, 2 FADH2, and 4 CO2' },
      { id: 'apb-7', term: 'Electron Transport Chain Location', definition: 'Inner Mitochondrial Membrane (Cristae)' },
      { id: 'apb-8', term: 'Final Electron Acceptor in Aerobic Respiration', definition: 'Oxygen (O2), forming H2O' },
      { id: 'apb-9', term: 'Chemiosmosis', definition: 'Movement of protons across a membrane down their electrochemical gradient to generate ATP via ATP synthase' },
      { id: 'apb-10', term: 'Total Theoretical ATP Yield', definition: '30 to 32 ATP molecules per oxidized glucose molecule' }
    ]
  },
  {
    id: 'set-ap-chem-1',
    title: 'AP Chemistry: Chemical Equilibrium & Le Chatelier',
    description: 'Equilibrium constants (Kc, Kp), reaction quotients (Q), and equilibrium shifts.',
    category: 'AP Chemistry',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 8,
    author: {
      name: 'Prof. Robert Sterling',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    },
    terms: [
      { id: 'apc-1', term: 'Equilibrium Constant (K)', definition: 'Ratio of equilibrium concentrations of products to reactants raised to power of their coefficients' },
      { id: 'apc-2', term: 'Reaction Quotient (Q)', definition: 'Calculated using product and reactant concentrations at any arbitrary point in time' },
      { id: 'apc-3', term: 'Q < K Condition', definition: 'Reaction shifts right towards products to achieve equilibrium' },
      { id: 'apc-4', term: 'Q > K Condition', definition: 'Reaction shifts left towards reactants to achieve equilibrium' },
      { id: 'apc-5', term: 'Le Chatelier\'s Principle', definition: 'If a dynamic equilibrium is disturbed, the system adjusts to minimize that disturbance' },
      { id: 'apc-6', term: 'Effect of Temperature Increase on Endothermic Reaction', definition: 'Shifts equilibrium to the right (K increases)' },
      { id: 'apc-7', term: 'Effect of Pressure Increase on Gaseous System', definition: 'Shifts equilibrium toward the side with fewer gas moles' },
      { id: 'apc-8', term: 'Effect of Catalyst on Equilibrium', definition: 'Speeds up both forward and reverse rates equally without changing K or position' }
    ]
  }
];
