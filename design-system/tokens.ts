export const TYPOGRAPHY = {
  headings: {
    fontFamily: '"Fredoka", sans-serif',
    weights: [300, 400, 500, 600, 700],
    sizes: {
      h1: 'text-6xl md:text-8xl',
      h2: 'text-4xl md:text-5xl',
      h3: 'text-3xl',
    }
  },
  body: {
    fontFamily: '"Nunito", sans-serif',
    weights: [400, 600, 700, 800],
    sizes: {
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    }
  }
};

export const COLORS = {
  primary: {
    name: 'Indigo',
    50: 'bg-indigo-50',
    100: 'bg-indigo-100',
    400: 'bg-indigo-400',
    500: 'bg-indigo-500',
    600: 'bg-indigo-600',
    900: 'bg-indigo-900',
  },
  secondary: {
    name: 'Purple',
    900: 'bg-purple-900',
  },
  accent: {
    yellow: {
      name: 'Yellow (Stars/Trophies)',
      100: 'bg-yellow-100',
      300: 'bg-yellow-300',
      400: 'bg-yellow-400',
      500: 'bg-yellow-500',
    },
    emerald: {
      name: 'Emerald (Success)',
      100: 'bg-emerald-100',
      400: 'bg-emerald-400',
      500: 'bg-emerald-500',
      600: 'bg-emerald-600',
    },
    orange: {
      name: 'Orange (Energy/XP)',
      100: 'bg-orange-100',
      400: 'bg-orange-400',
      500: 'bg-orange-500',
    },
    amber: {
      name: 'Amber',
      500: 'bg-amber-500',
    }
  },
  neutral: {
    name: 'Slate',
    50: 'bg-slate-50',
    100: 'bg-slate-100',
    200: 'bg-slate-200',
    300: 'bg-slate-300',
    400: 'bg-slate-400',
    500: 'bg-slate-500',
    700: 'bg-slate-700',
    800: 'bg-slate-800',
    900: 'bg-slate-900',
  }
};

export const RADIUS = {
  sm: 'rounded-xl',       // 12px
  md: 'rounded-2xl',      // 16px
  lg: 'rounded-3xl',      // 24px
  xl: 'rounded-[28px]',   // 28px
  xxl: 'rounded-[40px]',  // 40px
  xxxl: 'rounded-[48px]', // 48px
  full: 'rounded-[50px]', // 50px (Card base)
  circle: 'rounded-full',
};

export const SHADOWS = {
  book: 'shadow-2xl book-shadow',
  soft: 'shadow-lg',
  button: 'shadow-xl shadow-indigo-100/50',
};
