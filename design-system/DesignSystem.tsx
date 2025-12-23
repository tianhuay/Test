import React from 'react';
import { motion } from 'framer-motion';
import { TYPOGRAPHY, COLORS, RADIUS, SHADOWS } from './tokens';
import Button from '../components/Button';
import { Home, Mic, Star, Award, ChevronDown } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-16">
    <h2 className="text-3xl font-black text-slate-800 brand-font mb-8 pb-4 border-b border-slate-200">{title}</h2>
    {children}
  </section>
);

const ColorSwatch: React.FC<{ colorClass: string; shade: string; hex?: string }> = ({ colorClass, shade, hex }) => (
  <div className="flex flex-col gap-2">
    <div className={`w-full h-24 ${colorClass} rounded-2xl shadow-sm border border-black/5`}></div>
    <div className="flex flex-col">
      <span className="font-bold text-slate-700 text-sm">{shade}</span>
      <span className="text-slate-400 text-xs font-mono">{colorClass.replace('bg-', '')}</span>
    </div>
  </div>
);

const RadiusDemo: React.FC<{ radiusClass: string; name: string }> = ({ radiusClass, name }) => (
  <div className="flex flex-col items-center gap-3">
    <div className={`w-32 h-32 bg-indigo-500 ${radiusClass} flex items-center justify-center text-white font-bold shadow-lg`}>
      ABC
    </div>
    <span className="text-slate-600 font-bold text-sm">{name}</span>
    <code className="text-slate-400 text-xs bg-slate-100 px-2 py-1 rounded">{radiusClass}</code>
  </div>
);

export const DesignSystem: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-indigo-50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl brand-font">DS</div>
            <h1 className="text-2xl font-black text-indigo-900 brand-font">Design System</h1>
          </div>
          <Button variant="ghost" onClick={onExit} icon={<Home size={20} />}>Back to App</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Section title="1. Typography">
          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-bold text-slate-400 mb-6 uppercase tracking-wider">Headings (Fredoka)</h3>
              <div className="space-y-8 p-8 bg-white rounded-3xl border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-baseline gap-4">
                  <span className="w-32 text-slate-400 font-mono text-sm">H1 / Bold</span>
                  <h1 className={`${TYPOGRAPHY.headings.fontFamily} font-bold text-6xl text-slate-800`}>The quick brown fox</h1>
                </div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-4">
                  <span className="w-32 text-slate-400 font-mono text-sm">H2 / Black</span>
                  <h2 className={`${TYPOGRAPHY.headings.fontFamily} font-black text-5xl text-slate-800`}>Jumps over the lazy dog</h2>
                </div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-4">
                  <span className="w-32 text-slate-400 font-mono text-sm">H3 / SemiBold</span>
                  <h3 className={`${TYPOGRAPHY.headings.fontFamily} font-semibold text-3xl text-slate-800`}>Learning is fun and magical</h3>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-400 mb-6 uppercase tracking-wider">Body (Nunito)</h3>
              <div className="space-y-6 p-8 bg-white rounded-3xl border border-slate-100">
                <div className="flex flex-col md:flex-row gap-4">
                  <span className="w-32 text-slate-400 font-mono text-sm">Body / Regular</span>
                  <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <span className="w-32 text-slate-400 font-mono text-sm">Body / Bold</span>
                  <p className="text-base font-bold text-slate-800 max-w-2xl leading-relaxed">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="2. Colors">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(COLORS).map(([category, palette]: [string, any]) => (
              <div key={category} className="space-y-4">
                <h3 className="font-bold text-slate-800 capitalize flex items-center gap-2">
                  {palette.name}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(palette).map(([shade, className]: [string, any]) => {
                    if (shade === 'name') return null;
                    return (
                      <ColorSwatch key={shade} colorClass={className} shade={shade} />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="3. Corner Radius">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 p-8 bg-white rounded-[40px] border border-slate-100">
            {Object.entries(RADIUS).map(([name, className]) => (
              <RadiusDemo key={name} name={name} radiusClass={className} />
            ))}
          </div>
        </Section>

        <Section title="4. Spacing & Shadows">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-400 mb-6 uppercase tracking-wider">Shadows</h3>
              <div className="grid gap-8">
                <div className={`p-8 bg-white rounded-3xl ${SHADOWS.book} border border-indigo-50`}>
                  <p className="font-bold text-slate-700">Book Shadow (Depth)</p>
                  <code className="text-xs text-slate-400 mt-2 block">shadow-2xl book-shadow</code>
                </div>
                <div className={`p-8 bg-white rounded-3xl ${SHADOWS.soft} border border-slate-50`}>
                  <p className="font-bold text-slate-700">Soft Shadow</p>
                  <code className="text-xs text-slate-400 mt-2 block">shadow-lg</code>
                </div>
                <div className={`p-8 bg-indigo-600 rounded-3xl ${SHADOWS.button} text-white`}>
                  <p className="font-bold">Button Shadow</p>
                  <code className="text-xs text-indigo-200 mt-2 block">shadow-xl shadow-indigo-100/50</code>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-400 mb-6 uppercase tracking-wider">Spacing Examples</h3>
              <div className="bg-indigo-50/50 rounded-3xl p-8 space-y-4 border border-indigo-100/50">
                <div className="bg-white p-10 rounded-[48px] shadow-sm flex items-center justify-center border border-indigo-50">
                  <span className="text-slate-400 font-mono">p-10 (40px)</span>
                </div>
                <div className="bg-white p-8 rounded-[32px] shadow-sm flex items-center justify-center border border-indigo-50">
                  <span className="text-slate-400 font-mono">p-8 (32px)</span>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-center border border-indigo-50">
                  <span className="text-slate-400 font-mono">p-6 (24px)</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="5. UI Components">
            <div className="flex flex-wrap gap-6 items-center p-8 bg-white rounded-[40px] border border-slate-100">
                <Button variant="primary" icon={<Mic size={20} />}>Primary Action</Button>
                <Button variant="secondary" icon={<Star size={20} />}>Secondary</Button>
                <Button variant="danger" icon={<Award size={20} />}>Danger / Stop</Button>
                <Button variant="ghost" icon={<ChevronDown size={20} />}>Ghost</Button>
            </div>
        </Section>
      </main>
    </div>
  );
};

export default DesignSystem;
