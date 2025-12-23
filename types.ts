
export enum AppState {
  PROFILE_SELECTION = 'PROFILE_SELECTION',
  TOPIC_SELECTION = 'TOPIC_SELECTION',
  READING = 'READING',
  ANALYZING = 'ANALYZING',
  CELEBRATION = 'CELEBRATION',
  FEEDBACK = 'FEEDBACK',
  STATS = 'STATS',
  MIC_TEST = 'MIC_TEST',
  DESIGN_SYSTEM = 'DESIGN_SYSTEM'
}

export type Difficulty = 'easy' | 'medium' | 'challenge';
export type SyncStatus = 'synced' | 'syncing' | 'error' | 'offline';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  themeColor: string; // Tailwind class prefix e.g., 'indigo', 'orange'
  defaultDifficulty: Difficulty;
}

export interface SpeakingAnalysis {
  score: number; // Out of 100
  feedback: string;
  improvements: string[];
}

export interface StoryData {
  text: string;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface Topic {
  id: string;
  label: string;
  emoji: string;
  color: string;
  promptContext: string;
  subThemes: string[];
}

export const PROFILES: UserProfile[] = [
  {
    id: 'clara',
    name: 'Clara',
    age: 10,
    avatar: '👩‍🎓',
    themeColor: 'indigo',
    defaultDifficulty: 'medium'
  },
  {
    id: 'edison',
    name: 'Edison',
    age: 7,
    avatar: '🦸‍♂️',
    themeColor: 'orange',
    defaultDifficulty: 'easy'
  }
];

export const TOPICS: Topic[] = [
  { 
    id: 'animals', 
    label: 'Amazing Animals', 
    emoji: '🐨', 
    color: 'bg-emerald-100 text-emerald-700', 
    promptContext: 'Australian wildlife',
    subThemes: [
      'A baby koala learning to climb',
      'A kangaroo who wants to be a gymnast',
      'A wombat digging a secret tunnel',
      'A platypus looking for its glasses',
      'A kookaburra that cannot laugh',
      'A dingo puppy making a new friend'
    ]
  },
  { 
    id: 'science', 
    label: 'Cool Science', 
    emoji: '🔬', 
    color: 'bg-blue-100 text-blue-700', 
    promptContext: 'science and discovery',
    subThemes: [
      'A robot exploring a volcano',
      'A girl who invented a flying backpack',
      'Growing vegetables on Mars',
      'A microscopic journey inside a water drop',
      'The day gravity stopped working',
      'Talking to aliens with a radio'
    ]
  },
  { 
    id: 'fantasy', 
    label: 'Fairy Tales', 
    emoji: '🏰', 
    color: 'bg-purple-100 text-purple-700', 
    promptContext: 'magic and fantasy',
    subThemes: [
      'A dragon who breathes bubbles',
      'The princess who built a robot',
      'A hidden school for wizards in the outback',
      'A goblin who bakes the best cookies',
      'The tree that whispered secrets',
      'A flying carpet race'
    ]
  },
  { 
    id: 'history', 
    label: 'History', 
    emoji: '📜', 
    color: 'bg-amber-100 text-amber-800', 
    promptContext: 'history and past times',
    subThemes: [
      'A day in the life of a pyramid builder',
      'A Viking voyage across the sea',
      'The first gold rush in Ballarat',
      'A secret message from 100 years ago',
      'Dinosaur footprints on the beach',
      'A medieval castle tournament'
    ]
  },
  { 
    id: 'school', 
    label: 'School Life', 
    emoji: '🎒', 
    color: 'bg-orange-100 text-orange-700', 
    promptContext: 'school and friends',
    subThemes: [
      'The mystery of the missing lunchbox',
      'Winning the three-legged race',
      'The new student from a different planet',
      'A magical library book',
      'The school band talent show',
      'Building the tallest tower in class'
    ]
  },
  { 
    id: 'ocean', 
    label: 'Ocean Life', 
    emoji: '🐠', 
    color: 'bg-cyan-100 text-cyan-700', 
    promptContext: 'ocean and sea creatures',
    subThemes: [
      'A shark who is afraid of the dark',
      'A glowing fish in the deep sea',
      'The turtle\'s long journey home',
      'A dolphin rescue mission',
      'The city of crabs under the sand',
      'A surfer meeting a friendly whale'
    ]
  },
  { 
    id: 'sports', 
    label: 'Sports Stars', 
    emoji: '🏆', 
    color: 'bg-rose-100 text-rose-700', 
    promptContext: 'sports and teamwork',
    subThemes: [
      'Winning the AFL grand final',
      'The fastest swimmer in the school pool',
      'A local cricket match in the sun',
      'Learning to surf at Bondi Beach',
      'A gymnast doing a perfect backflip',
      'The school cross country race'
    ]
  },
  { 
    id: 'space', 
    label: 'Space Explorers', 
    emoji: '🚀', 
    color: 'bg-slate-200 text-slate-800', 
    promptContext: 'space travel and planets',
    subThemes: [
      'Finding a giant diamond on Saturn',
      'A cat wearing a silver spacesuit',
      'Visiting the dark side of the moon',
      'A rocket ship made of recycled boxes',
      'Having a zero-gravity lunch',
      'Searching for a new planet to call home'
    ]
  },
  { 
    id: 'cooking', 
    label: 'Little Chefs', 
    emoji: '🍳', 
    color: 'bg-yellow-100 text-yellow-800', 
    promptContext: 'cooking and delicious food',
    subThemes: [
      'Baking the world\'s largest pavlova',
      'The pizza that started floating away',
      'Decorating cupcakes for a dragon\'s party',
      'Finding secret bush tucker in the garden',
      'A sandwich that is taller than a house',
      'The magic pot that never stops making honey'
    ]
  },
  { 
    id: 'nature', 
    label: 'Nature Guardians', 
    emoji: '🌿', 
    color: 'bg-lime-100 text-lime-800', 
    promptContext: 'environment and protecting nature',
    subThemes: [
      'Planting a seed that grows into a skyscraper',
      'Cleaning up the creek with my best friends',
      'Talking to a very old eucalyptus tree',
      'A race between solar-powered toy cars',
      'Protecting the busy bees in the park',
      'The secret hidden life of backyard bugs'
    ]
  },
  { 
    id: 'mystery', 
    label: 'Mystery Solvers', 
    emoji: '🔍', 
    color: 'bg-zinc-200 text-zinc-700', 
    promptContext: 'mystery and clues',
    subThemes: [
      'The strange case of the barking cat',
      'Searching for the missing library key',
      'Following giant footsteps in the mud',
      'A treasure map found inside an old shoe',
      'The friendly ghost in the garden shed',
      'A mysterious purple light in the attic'
    ]
  },
  { 
    id: 'world', 
    label: 'World Travelers', 
    emoji: '✈️', 
    color: 'bg-violet-100 text-violet-700', 
    promptContext: 'world cultures and travel',
    subThemes: [
      'Walking across the Great Wall of China',
      'Riding a big red bus through London',
      'Eating yummy sushi for lunch in Japan',
      'A snowy mountain adventure in New Zealand',
      'A boat trip down the Amazon river',
      'Seeing the Eiffel Tower sparkle at night'
    ]
  }
];
