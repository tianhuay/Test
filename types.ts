
export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string; // YYYY-MM-DD
}

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Housing'
  | 'Education'
  | 'Other';

export interface CategoryMeta {
  label: ExpenseCategory;
  icon: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { label: 'Food & Dining',  icon: '🍽️', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { label: 'Transport',      icon: '🚗', color: 'text-blue-600',   bgColor: 'bg-blue-100'   },
  { label: 'Shopping',       icon: '🛍️', color: 'text-pink-600',   bgColor: 'bg-pink-100'   },
  { label: 'Entertainment',  icon: '🎬', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { label: 'Health',         icon: '💊', color: 'text-red-600',    bgColor: 'bg-red-100'    },
  { label: 'Housing',        icon: '🏠', color: 'text-teal-600',   bgColor: 'bg-teal-100'   },
  { label: 'Education',      icon: '📚', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  { label: 'Other',          icon: '📦', color: 'text-gray-600',   bgColor: 'bg-gray-100'   },
];
