
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, TrendingUp, DollarSign, Calendar, Tag, ChevronDown } from 'lucide-react';
import { Expense, ExpenseCategory, CATEGORIES } from './types';

// ── Helpers ────────────────────────────────────────────────────────────────

const generateId = () => Math.random().toString(36).slice(2, 10);

const todayISO = () => new Date().toISOString().split('T')[0];

const formatCurrency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const getCategoryMeta = (label: ExpenseCategory) =>
  CATEGORIES.find(c => c.label === label) ?? CATEGORIES[CATEGORIES.length - 1];

// ── Sample data ─────────────────────────────────────────────────────────────

const SEED_EXPENSES: Expense[] = [
  { id: generateId(), amount: 42.50, category: 'Food & Dining',  description: 'Dinner at Italian place', date: '2026-03-12' },
  { id: generateId(), amount: 28.00, category: 'Transport',      description: 'Monthly bus pass top-up',  date: '2026-03-10' },
  { id: generateId(), amount: 95.99, category: 'Shopping',       description: 'New running shoes',        date: '2026-03-08' },
  { id: generateId(), amount: 14.99, category: 'Entertainment',  description: 'Streaming subscription',   date: '2026-03-01' },
];

// ── Sub-components ──────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon, accent }) => (
  <div className={`rounded-2xl p-5 flex items-start gap-4 shadow-sm border border-white/60 ${accent}`}>
    <div className="p-2 bg-white/60 rounded-xl text-xl">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide opacity-60">{label}</p>
      <p className="text-2xl font-bold mt-0.5 truncate">{value}</p>
      {sub && <p className="text-xs mt-0.5 opacity-60">{sub}</p>}
    </div>
  </div>
);

// ── Add Expense Form ────────────────────────────────────────────────────────

interface AddExpenseFormProps {
  onAdd: (expense: Expense) => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onAdd }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }
    onAdd({ id: generateId(), amount: parsed, category, description: description.trim(), date });
    setAmount('');
    setDescription('');
    setDate(todayISO());
    setError('');
  };

  const inputCls =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
        <PlusCircle size={20} className="text-indigo-500" /> Add Expense
      </h2>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Amount + Category */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Amount ($)</label>
          <div className="relative">
            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number" min="0.01" step="0.01" placeholder="0.00"
              value={amount} onChange={e => setAmount(e.target.value)}
              className={`${inputCls} pl-8`}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
          <div className="relative">
            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)}
              className={`${inputCls} pl-8 pr-8 appearance-none`}
            >
              {CATEGORIES.map(c => (
                <option key={c.label} value={c.label}>{c.icon} {c.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Description + Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
          <input
            type="text" placeholder="What was it for?" maxLength={60}
            value={description} onChange={e => setDescription(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date" value={date} onChange={e => setDate(e.target.value)}
              className={`${inputCls} pl-8`}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-xl py-2.5 text-sm transition"
      >
        Add Expense
      </button>
    </form>
  );
};

// ── Expense List ────────────────────────────────────────────────────────────

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  filter: string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, filter }) => {
  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return expenses.filter(
      e =>
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q),
    ).sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, filter]);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">💸</p>
        <p className="font-medium">{filter ? 'No matching expenses.' : 'No expenses yet. Add one above!'}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      <AnimatePresence initial={false}>
        {filtered.map(expense => {
          const meta = getCategoryMeta(expense.category);
          return (
            <motion.li
              key={expense.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 group"
            >
              {/* Category icon */}
              <span className={`text-xl w-10 h-10 flex items-center justify-center rounded-xl shrink-0 ${meta.bgColor}`}>
                {meta.icon}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{expense.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{expense.category} · {formatDate(expense.date)}</p>
              </div>

              {/* Amount */}
              <span className="font-bold text-gray-800 text-base shrink-0">
                {formatCurrency(expense.amount)}
              </span>

              {/* Delete */}
              <button
                onClick={() => onDelete(expense.id)}
                aria-label="Delete expense"
                className="ml-1 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 size={15} />
              </button>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
};

// ── Category Breakdown ──────────────────────────────────────────────────────

interface BreakdownProps {
  expenses: Expense[];
}

const Breakdown: React.FC<BreakdownProps> = ({ expenses }) => {
  const totals = useMemo(() => {
    const map: Partial<Record<ExpenseCategory, number>> = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a) as [ExpenseCategory, number][];
  }, [expenses]);

  const grand = totals.reduce((s, [, v]) => s + v, 0);

  if (grand === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-sm">
        <TrendingUp size={16} className="text-indigo-500" /> Breakdown by Category
      </h3>
      <ul className="space-y-3">
        {totals.map(([cat, total]) => {
          const meta = getCategoryMeta(cat);
          const pct = Math.round((total / grand) * 100);
          return (
            <li key={cat}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <span>{meta.icon}</span> {cat}
                </span>
                <span className="text-gray-500">{formatCurrency(total)} <span className="text-gray-300 text-xs">({pct}%)</span></span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${meta.bgColor.replace('bg-', 'bg-').replace('-100', '-400')}`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// ── Main App ────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(SEED_EXPENSES);
  const [search, setSearch] = useState('');

  const addExpense = (e: Expense) => setExpenses(prev => [e, ...prev]);
  const deleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));

  const total = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  // Month totals
  const thisMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    return expenses
      .filter(e => {
        const [ey, em] = e.date.split('-').map(Number);
        return ey === y && em - 1 === m;
      })
      .reduce((s, e) => s + e.amount, 0);
  }, [expenses]);

  const topCategory = useMemo(() => {
    if (!expenses.length) return '—';
    const map: Partial<Record<ExpenseCategory, number>> = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] ?? 0) + e.amount; });
    return Object.entries(map).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—';
  }, [expenses]);

  const topMeta = getCategoryMeta(topCategory as ExpenseCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Expense Tracker</h1>
            <p className="text-sm text-gray-400 mt-0.5">Keep tabs on where your money goes</p>
          </div>
          <span className="text-4xl select-none">💰</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Total"
            value={formatCurrency(total)}
            sub={`${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`}
            icon={<DollarSign size={18} />}
            accent="bg-indigo-50 text-indigo-900"
          />
          <StatCard
            label="This Month"
            value={formatCurrency(thisMonth)}
            icon={<Calendar size={18} />}
            accent="bg-emerald-50 text-emerald-900"
          />
          <StatCard
            label="Top Category"
            value={topCategory === '—' ? '—' : topMeta.icon}
            sub={topCategory !== '—' ? topCategory : undefined}
            icon={<TrendingUp size={18} />}
            accent="bg-orange-50 text-orange-900"
          />
        </div>

        {/* Add form */}
        <AddExpenseForm onAdd={addExpense} />

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search expenses…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>

        {/* Expense list */}
        <ExpenseList expenses={expenses} onDelete={deleteExpense} filter={search} />

        {/* Breakdown */}
        {!search && <Breakdown expenses={expenses} />}

      </div>
    </div>
  );
};

export default App;
