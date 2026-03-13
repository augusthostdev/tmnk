export interface Monk {
  id: string;
  name: string;
  standard: string;
  class: string;
  avatar?: string;
  initials?: string;
}

export const monksData: Monk[] = [
  // A
  {
    id: '1',
    name: 'Ven. Dhammapala',
    standard: 'Grade 1',
    class: 'A',
  },
  {
    id: '2',
    name: 'Ven. Kassapa',
    standard: 'Grade 2',
    class: 'B',
  },
  // B
  {
    id: '3',
    name: 'Ven. Narada',
    standard: 'Grade 1',
    class: 'C',
    initials: 'BR',
  },
  // C
  {
    id: '4',
    name: 'Ven. Sobhita',
    standard: 'Grade 3',
    class: 'A',
  },
  {
    id: '5',
    name: 'Ven. Tiloka',
    standard: 'Grade 2',
    class: 'D',
  },
];
