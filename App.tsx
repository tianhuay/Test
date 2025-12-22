
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Mic, Square, Play, RefreshCw, Volume2, Award, BookOpen, Wand2, Home, Settings2, Image as ImageIcon, Pause, BarChart3, Star, CheckCircle2, User, LogOut, X, AlertCircle, Trophy, Flame, CheckSquare, PauseCircle, PlayCircle, XCircle, Cloud, CloudOff, Loader2, ChevronDown, Headphones, HeadphoneOff, TrendingUp, Sparkles, Rocket, ShieldCheck, Lock, Unlock, Trash2, KeyRound, Circle, Target, Medal, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

import { AppState, Topic, TOPICS, SpeakingAnalysis, StoryData, Difficulty, PROFILES, UserProfile, SyncStatus } from './types';
import { analyzeAudio, playTextToSpeech, generateStoryImage, stopTextToSpeech, prefetchAudio } from './services/geminiService';
import { generateReadingMaterial } from './services/storyService';
import { playSuccessSound, playStartRecordingSound, playStopRecordingSound, playClickSound, playCelebrationSound, playHoverSound } from './services/soundEffects';
import { getDailyTarget, fetchUserData, getTodayDateString, resetUserData, clearOfflineMode, clearAllLocalData } from './services/storageService';
import { incrementDailyProgress } from './services/storageService';
import Button from './components/Button';

// --- Sub-components ---

const CountUp: React.FC<{ end: number, duration?: number }> = ({ end, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.round(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return <>{count}</>;
};

const CelebrationOverlay: React.FC<{ score: number, onComplete: () => void }> = ({ score, onComplete }) => {
  useEffect(() => {
    playCelebrationSound();
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff0000', '#00ff00', '#0000ff'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff0000', '#00ff00', '#0000ff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white overflow-hidden text-center">
      <div className="absolute inset-0 opacity-30"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vmax] h-[200vmax] bg-[conic-gradient(from_0deg,transparent_0deg,white_20deg,transparent_40deg)] animate-spin-slow"></div></div>
      <motion.div initial={{ scale: 0.5, y: 100 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="relative z-10 flex flex-col items-center p-6">
        <div className="text-[120px] mb-4 drop-shadow-2xl">{score >= 90 ? '🏆' : '🌟'}</div>
        <h1 className="text-6xl md:text-8xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 drop-shadow-lg brand-font">{score >= 90 ? 'EXCELLENT!' : 'WELL DONE!'}</h1>
        <p className="text-2xl md:text-3xl font-bold text-indigo-200">Result: <span className="text-white text-4xl">{Math.round(score)}/100</span></p>
      </motion.div>
    </motion.div>
  );
};

const Header: React.FC<{ user: UserProfile, xp: number, todayCount: number, todayXp: number, syncStatus: SyncStatus, onShowStats: () => void, onSwitchProfile: (p: UserProfile) => void }> = ({ user, xp, todayCount, todayXp, syncStatus, onShowStats, onSwitchProfile }) => {
  const target = getDailyTarget();
  const otherProfile = PROFILES.find(p => p.id !== user.id);
  const [showSwitch, setShowSwitch] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setShowSwitch(false);
      }
    };
    if (showSwitch) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSwitch]);

  return (
    <header className="w-full max-w-7xl mx-auto p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-b-3xl sticky top-0 z-50 shadow-sm border-b border-indigo-50">
      <div className="flex items-center gap-2 relative" ref={switcherRef}>
        <div 
          onClick={() => { playClickSound(); setShowSwitch(!showSwitch); }}
          className={`p-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-all flex items-center gap-2 border-2 ${showSwitch ? 'border-indigo-400' : 'border-transparent'} ${user.themeColor === 'orange' ? 'bg-orange-100' : 'bg-indigo-100'}`}
        >
          <span className="text-2xl">{user.avatar}</span>
          <span className="font-bold text-slate-700 hidden sm:block">{user.name}</span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${showSwitch ? 'rotate-180' : ''}`} />
        </div>

        <AnimatePresence>
          {showSwitch && otherProfile && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-indigo-50 overflow-hidden z-50"
            >
              <button 
                onClick={() => { playClickSound(); onSwitchProfile(otherProfile); setShowSwitch(false); }}
                className="w-full p-4 flex items-center gap-3 hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-0"
              >
                <span className="text-2xl">{otherProfile.avatar}</span>
                <div className="text-left">
                  <p className="font-bold text-slate-800">Switch to {otherProfile.name}</p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="ml-2" title={syncStatus === 'synced' ? "Progress Saved" : syncStatus === 'error' ? "Offline - Saved Locally" : "Syncing..."}>
          {syncStatus === 'synced' && <Cloud size={16} className="text-emerald-500" />}
          {syncStatus === 'syncing' && <Loader2 size={16} className="text-indigo-400 animate-spin" />}
          {(syncStatus === 'error' || syncStatus === 'offline') && <CloudOff size={16} className="text-amber-500" />}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div onClick={() => { playClickSound(); onShowStats(); }} className="flex items-center gap-2 bg-white border-2 border-indigo-100 rounded-full px-4 py-2.5 cursor-pointer hover:bg-indigo-50 transition-colors" title="Daily Goal">
          <span className="text-sm font-bold text-indigo-400 mr-1 hidden sm:inline">Daily Goal:</span>
          {[...Array(target)].map((_, i) => (
            <motion.div key={i} initial={false} animate={{ scale: i < todayCount ? [1.2, 1] : 1 }}>
              <Star size={24} className={i < todayCount ? "fill-yellow-400 text-yellow-500" : "text-slate-200"} />
            </motion.div>
          ))}
          {todayCount > target && <span className="text-sm font-black text-amber-500 ml-1">+{todayCount - target}</span>}
        </div>

        <div onClick={() => { playClickSound(); onShowStats(); }} className="flex items-center gap-2 bg-white border-2 border-indigo-100 rounded-full px-4 py-2.5 cursor-pointer hover:bg-indigo-50 transition-colors" title="XP Earned Today">
          <Zap size={24} className="text-orange-500 fill-orange-500" />
          <span className="text-sm font-bold text-orange-400 mr-1 hidden sm:inline">Today's XP:</span>
          <span className="text-base font-black text-indigo-900">{Math.round(todayXp)}</span>
        </div>
        
        <motion.div key={xp} initial={{ scale: 1.1 }} animate={{ scale: 1 }} onClick={() => { playClickSound(); onShowStats(); }} className="flex items-center gap-2 bg-white border-2 border-indigo-100 rounded-full px-4 py-2.5 cursor-pointer hover:bg-indigo-50 transition-colors" title="Total XP">
          <Award size={24} className="text-amber-500" />
          <span className="text-sm font-bold text-amber-500 mr-1 hidden sm:inline">Total XP:</span>
          <span className="text-base font-black text-indigo-900">{Math.round(xp)}</span>
        </motion.div>
      </div>
    </header>
  );
};

const ResultCard: React.FC<{ result: SpeakingAnalysis, onRetry: () => void, onHome: () => void, onStats: () => void }> = ({ result, onRetry, onHome, onStats }) => {
  const isExcellent = result.score >= 90;
  const isGood = result.score >= 70;

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85, y: 50 },
    visible: { 
      opacity: 1, scale: 1, y: 0,
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 12,
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full bg-white rounded-[50px] p-8 md:p-14 shadow-2xl book-shadow border border-indigo-50/50 text-center relative overflow-hidden">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ repeat: Infinity, duration: 4 }} className={`absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 blur-3xl rounded-full -z-10 ${isExcellent ? 'bg-yellow-400' : isGood ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
      
      <motion.div variants={itemVariants} className="mb-10 relative">
        <div className="relative inline-block mb-8">
          <svg className="w-48 h-48 md:w-56 md:h-56" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
            <motion.circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={339.3} initial={{ strokeDashoffset: 339.3 }} animate={{ strokeDashoffset: 339.3 - (339.3 * result.score) / 100 }} transition={{ duration: 2.5, ease: "circOut", delay: 0.5 }} strokeLinecap="round" className={`origin-center transform ${result.score >= 85 ? "text-emerald-500" : result.score >= 60 ? "text-amber-500" : "text-indigo-500"}`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
             <span className="text-7xl font-black text-slate-800 brand-font tracking-tight mb-1"><CountUp end={Math.round(result.score)} duration={2.5} /></span>
             <motion.div initial={{ opacity: 0, scale: 0, y: 20 }} animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }} transition={{ opacity: { delay: 2.5, duration: 0.5 }, scale: { delay: 2.5, type: "spring", stiffness: 200 }, y: { delay: 3, repeat: Infinity, duration: 2, ease: "easeInOut" } }} className="mt-1">
               {isExcellent ? <div className="bg-yellow-100 p-3 rounded-2xl shadow-lg border-2 border-yellow-200"><Trophy size={28} className="text-yellow-600" /></div> : isGood ? <div className="bg-emerald-100 p-3 rounded-2xl shadow-lg border-2 border-emerald-200"><Medal size={28} className="text-emerald-600" /></div> : <div className="bg-indigo-100 p-3 rounded-2xl shadow-lg border-2 border-indigo-200"><Star size={28} className="text-indigo-600 fill-indigo-200" /></div>}
             </motion.div>
          </div>
        </div>
        <motion.h2 variants={itemVariants} className="text-4xl font-black text-slate-900 mb-4 brand-font">{isExcellent ? "Outstanding!" : isGood ? "Brilliant Work!" : "Great Practice!"}</motion.h2>
        <motion.p variants={itemVariants} className="text-slate-500 font-bold leading-relaxed text-xl max-w-2xl mx-auto">{result.feedback}</motion.p>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-indigo-50/40 rounded-[44px] p-8 md:p-10 mb-10 text-left border border-indigo-100/50 relative backdrop-blur-sm">
        <div className="absolute -top-4 left-10 bg-indigo-600 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2"><Target className="w-4 h-4" /> Focus Areas</div>
        <ul className="space-y-4 pt-4">
          {result.improvements.map((tip, idx) => (
            <motion.li key={idx} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + (idx * 0.25), type: "spring" }} className="flex items-start gap-4 text-slate-700 font-bold text-lg bg-white/80 p-5 rounded-3xl shadow-sm border border-indigo-50/50 hover:shadow-md hover:bg-white transition-all duration-300 group">
              <div className="p-1 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform"><CheckCircle2 size={24} className="text-emerald-500 flex-shrink-0" /></div>
              <span className="leading-tight">{tip}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-5 max-w-lg mx-auto w-full">
        <Button variant="secondary" onClick={() => { playClickSound(); onHome(); }} icon={<Home size={24} />} className="py-6 !rounded-[28px] !text-base font-black uppercase tracking-widest border-b-4 border-slate-100 active:border-b-0 active:translate-y-1 transition-all">Home</Button>
        <Button onClick={() => { playClickSound(); onRetry(); }} icon={<RefreshCw size={24} />} className="py-6 bg-indigo-600 text-white !rounded-[28px] !text-base font-black uppercase tracking-widest border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all shadow-xl shadow-indigo-100/50">Retry</Button>
      </motion.div>
    </motion.div>
  );
};

const TopicCard: React.FC<{ topic: Topic; onClick: () => void }> = ({ topic, onClick }) => (
  <motion.button whileHover={{ y: -8, scale: 1.02 }} whileTap={{ scale: 0.98 }} onMouseEnter={playHoverSound} onClick={() => { playClickSound(); onClick(); }} className={`p-8 rounded-[40px] text-left h-full flex flex-col gap-4 transition-all ${topic.color} border-4 border-transparent hover:border-white relative overflow-hidden group w-full`}>
    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
    <span className="text-5xl filter drop-shadow-md z-10">{topic.emoji}</span>
    <div className="z-10">
      <h3 className="text-2xl font-black mb-1 brand-font" style={{ letterSpacing: '1.5px' }}>{topic.label}</h3>
      <p className="text-sm opacity-90 font-bold">Explore stories about {topic.promptContext}</p>
    </div>
  </motion.button>
);

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-white/95 z-[100] flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
    <div className="relative mb-10">
      <div className="w-32 h-32 border-[10px] border-indigo-50 border-t-indigo-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Loader2 className="text-indigo-500 w-12 h-12" />
        </motion.div>
      </div>
    </div>
    <h2 className="text-3xl md:text-4xl font-black text-indigo-900 mb-3 brand-font">{message}</h2>
    <p className="text-slate-400 font-bold animate-pulse text-lg tracking-wide uppercase">Magical things are happening...</p>
  </div>
);

const AdaptiveProgressDots: React.FC<{ count: number, themeColor: string, isGoalDone: boolean, dailyXp: number }> = ({ count, themeColor, isGoalDone, dailyXp }) => {
  const target = getDailyTarget();
  const displayDots = Math.max(target, count);
  const dotsArray = Array.from({ length: displayDots }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex flex-wrap gap-1 justify-center max-w-[80px]">
        {dotsArray.map(i => {
          const isExtra = i > target;
          const isActive = i <= count;
          const colorClass = isActive ? (isExtra ? 'bg-yellow-400' : `bg-${themeColor}-500`) : 'bg-slate-100';
          return <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: i * 0.03 }} className={`w-2.5 h-2.5 rounded-full ${colorClass} ${isActive && isExtra ? 'shadow-[0_0_6px_rgba(250,204,21,0.5)]' : ''}`} />;
        })}
      </div>
      <div className={`text-[9px] font-black leading-tight ${isGoalDone ? 'text-indigo-600' : 'text-slate-300'}`}>{count > target ? `+${count-target} XP` : (isGoalDone ? 'DONE' : `${count}/${target}`)}</div>
      {dailyXp > 0 && <span className="text-[10px] font-black text-orange-400">{dailyXp} XP</span>}
    </div>
  );
};

const AdminPanel: React.FC<{ onClose: () => void, onReset: () => void }> = ({ onClose, onReset }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  useEffect(() => { if (password === '0316') { setIsUnlocked(true); playSuccessSound(); } }, [password]);
  const handleReset = async () => { if (window.confirm("WIPE ALL DATA?")) { setIsResetting(true); onReset(); } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[48px] shadow-2xl max-w-md w-full text-center relative overflow-hidden border border-slate-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6"><ShieldCheck className="text-indigo-600 w-10 h-10" /></div>
        <h2 className="text-3xl font-black text-slate-800 brand-font mb-2">Admin Tools</h2>
        {!isUnlocked ? (
          <div className="space-y-6">
            <input type="password" placeholder="••••" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 text-center text-3xl font-black tracking-[1em] focus:border-indigo-400 outline-none" />
          </div>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
             <Button variant="danger" onClick={handleReset} isLoading={isResetting} icon={<Trash2 size={20} />} className="w-full py-5">WIPE ALL DATA</Button>
          </motion.div>
        )}
        <div className="mt-12 pt-6 border-t border-slate-50 flex justify-center"><button onClick={() => { playClickSound(); onClose(); }} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black text-sm uppercase">Exit Admin</button></div>
      </div>
    </motion.div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.PROFILE_SELECTION);
  const [xp, setXp] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [storyImageUrl, setStoryImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [todayCount, setTodayCount] = useState(0);
  const [todayXp, setTodayXp] = useState(0);
  const [history, setHistory] = useState<Record<string, number>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false); 
  const [micVolume, setMicVolume] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isAudioPrefetching, setIsAudioPrefetching] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [prefetchError, setPrefetchError] = useState(false);
  const [useGuide, setUseGuide] = useState(false); 
  const [pacerIndex, setPacerIndex] = useState(-1);
  const [words, setWords] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<SpeakingAnalysis | null>(null);
  const [flashingWordIndex, setFlashingWordIndex] = useState<number | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState<{ [key: string]: any }>({});
  const [isFetchingStats, setIsFetchingStats] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);
  const totalLengthRef = useRef(0);

  useEffect(() => { return () => { stopTextToSpeech(); cleanupAudioContext(); }; }, []);

  const cleanupAudioContext = () => {
    if (processorRef.current) processorRef.current.disconnect();
    if (sourceRef.current) {
        if (sourceRef.current.mediaStream) sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
        sourceRef.current.disconnect();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
    audioContextRef.current = null; processorRef.current = null; sourceRef.current = null;
  };

  const abortSpeakingSession = () => {
    if (isRecording) { cleanupAudioContext(); setIsRecording(false); setIsPaused(false); setMicVolume(0); setPacerIndex(-1); }
    if (isAudioPlaying) { stopTextToSpeech(); setIsAudioPlaying(false); }
    stopTextToSpeech();
  };

  useEffect(() => { if (appState !== AppState.READING && appState !== AppState.ANALYZING) abortSpeakingSession(); }, [appState]);

  const handleProfileSelect = async (profile: UserProfile) => {
    playClickSound(); abortSpeakingSession(); setIsInitializing(true); setCurrentUser(profile); setDifficulty(profile.defaultDifficulty);
    try {
      const { xp, todayCount, todayXp, history, fromCloud } = await fetchUserData(profile.id);
      setXp(Math.round(xp)); setTodayCount(todayCount); setTodayXp(todayXp); setHistory(history); setSyncStatus(fromCloud ? 'synced' : 'offline');
      setAppState(AppState.TOPIC_SELECTION);
    } catch (e) { setAppState(AppState.TOPIC_SELECTION); } finally { setIsInitializing(false); }
  };

  const generateNewStory = async (topic: Topic) => {
    abortSpeakingSession();
    setIsAudioPrefetching(false);
    setIsAudioReady(false);
    setPrefetchError(false);
    setAppState(AppState.READING); 
    setAnalysisError(null);
    setStoryData(null); 
    setStoryImageUrl(null); 
    setWords([]); 
    setUseGuide(false);
    setIsLoading(true); 
    setIsImageLoading(true);
    
    const randomTheme = topic.subThemes[Math.floor(Math.random() * topic.subThemes.length)];
    const promptContext = `${randomTheme} (${topic.label})`;
    
    generateStoryImage(promptContext).then(url => { setStoryImageUrl(url); setIsImageLoading(false); });
    generateReadingMaterial(promptContext, difficulty).then(data => { 
      setStoryData(data); 
      setWords(data.text.trim().split(/\s+/)); 
      setIsLoading(false); 
      
      // Start Prefetching Audio
      setIsAudioPrefetching(true);
      const prefetch = prefetchAudio(data.text);
      if (prefetch) {
        prefetch
          .then(() => { setIsAudioReady(true); setPrefetchError(false); })
          .catch((e: any) => { 
             console.error("Prefetch failed:", e);
             setIsAudioReady(false);
             setPrefetchError(true);
             const errorMsg = JSON.stringify(e).toLowerCase();
             if (errorMsg.includes('429') || errorMsg.includes('quota_exceeded')) {
               setAnalysisError("The story magic needs a quick break! Try 'Listen' later.");
             }
          })
          .finally(() => setIsAudioPrefetching(false));
      } else {
        setIsAudioPrefetching(false);
      }
    });
  };

  const handleTopicSelect = (topic: Topic) => { setCurrentTopic(topic); generateNewStory(topic); };

  const handleRefresh = () => { if (currentTopic) { playClickSound(); generateNewStory(currentTopic); } };

  const startRecording = async () => {
    if (isAudioPlaying) { stopTextToSpeech(); setIsAudioPlaying(false); }
    playStartRecordingSound();
    try {
      cleanupAudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      audioChunksRef.current = []; totalLengthRef.current = 0;
      processor.onaudioprocess = (e) => {
        if (!isPaused) {
          const inputData = e.inputBuffer.getChannelData(0);
          let sum = 0; for (let i = 0; i < inputData.length; i++) sum += Math.abs(inputData[i]);
          setMicVolume(Math.min(255, (sum / inputData.length) * 800));
          audioChunksRef.current.push(new Float32Array(inputData)); totalLengthRef.current += inputData.length;
        } else setMicVolume(0);
      };
      source.connect(processor); processor.connect(audioCtx.destination);
      setIsRecording(true); setIsPaused(false); setPacerIndex(useGuide ? 0 : -1);
    } catch (err) { alert("Microphone access needed!"); }
  };

  const stopRecording = () => {
    playStopRecordingSound();
    if (isRecording) {
      const sampleRate = audioContextRef.current?.sampleRate || 44100;
      cleanupAudioContext();
      setIsRecording(false); setIsPaused(false); setMicVolume(0);
      if (totalLengthRef.current === 0) { setAnalysisError("No audio captured."); return; }
      const merged = new Float32Array(totalLengthRef.current);
      let offset = 0;
      for (const chunk of audioChunksRef.current) { merged.set(chunk, offset); offset += chunk.length; }
      const wav = encodeWAV(merged, sampleRate);
      handleAnalysis(wav);
    }
  };

  const encodeWAV = (samples: Float32Array, sampleRate: number) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    const writeString = (v: DataView, o: number, s: string) => { for (let i=0; i<s.length; i++) v.setUint8(o+i, s.charCodeAt(i)); };
    writeString(view, 0, 'RIFF'); view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE'); writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);
    let off = 44;
    for (let i=0; i<samples.length; i++, off+=2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return new Blob([view], { type: 'audio/wav' });
  };

  const handleAnalysis = async (blob: Blob) => {
    if (!storyData || !currentUser) return;
    setAppState(AppState.ANALYZING);
    try {
      const rawResult = await analyzeAudio(blob, storyData.text, currentUser.name, currentUser.age);
      const result = { ...rawResult, score: Math.round(rawResult.score) };
      setAnalysisResult(result);
      const { newCount, newTodayXp } = await incrementDailyProgress(currentUser.id, result.score);
      setTodayCount(newCount); setTodayXp(newTodayXp); setXp(prev => Math.round(prev + result.score));
      setAppState(result.score >= 85 ? AppState.CELEBRATION : AppState.FEEDBACK);
    } catch (e: any) { 
      const errorStr = JSON.stringify(e).toLowerCase();
      if (errorStr.includes('429') || errorStr.includes('quota_exceeded')) {
        setAnalysisError("The AI is very busy! Take a quick break and try again.");
      } else {
        setAnalysisError("AI is thinking hard! Please wait a moment.");
      }
      setAppState(AppState.READING); 
    }
  };

  const handleWordClick = async (word: string, index: number) => {
    if (isRecording || isAudioPlaying || isLoading) return;
    playClickSound();
    const cleanWord = word.replace(/[.,!?;:"()]/g, '');
    try {
      setFlashingWordIndex(index);
      await playTextToSpeech(cleanWord);
      setTimeout(() => setFlashingWordIndex(null), 600);
    } catch (e: any) { 
      setFlashingWordIndex(null); 
      setAnalysisError("The magic guide needs a rest. Try again in a few seconds!");
      setTimeout(() => setAnalysisError(null), 3000);
    }
  };

  const handleListenGuide = async () => {
    if (isAudioPlaying) { stopTextToSpeech(); setIsAudioPlaying(false); return; }
    if (!storyData) return;
    abortSpeakingSession();
    playClickSound();
    setIsAudioLoading(true);
    try {
      await playTextToSpeech(storyData.text, () => setIsAudioPlaying(false));
      setIsAudioPlaying(true);
      setIsAudioReady(true);
      setPrefetchError(false);
    } catch (e: any) {
      const errorStr = JSON.stringify(e).toLowerCase();
      const msg = (errorStr.includes('429') || errorStr.includes('quota_exceeded'))
        ? "The magic guide needs a break! Daily limits reached."
        : "The story guide is taking a nap. Try again soon!";
      setAnalysisError(msg);
      setTimeout(() => setAnalysisError(null), 4000);
      setIsAudioReady(false);
      setPrefetchError(true);
    } finally { setIsAudioLoading(false); }
  };

  const handleShowStats = async () => {
    abortSpeakingSession(); setAppState(AppState.STATS); setIsFetchingStats(true);
    try {
      const [clara, edison] = await Promise.all([fetchUserData('clara'), fetchUserData('edison')]);
      setComparisonData({ clara, edison });
    } catch (e) { console.error(e); } finally { setIsFetchingStats(false); }
  };

  const handleResetApp = async () => { clearAllLocalData(); window.location.reload(); };

  useEffect(() => {
    if (isRecording && useGuide && !isPaused && pacerIndex >= 0 && pacerIndex < words.length) {
      const word = words[pacerIndex];
      let delay = 350; 
      if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) delay = 1000;
      else if (word.endsWith(',') || word.endsWith(';') || word.endsWith(':')) delay = 650;
      const timer = setTimeout(() => setPacerIndex(pacerIndex + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [isRecording, useGuide, isPaused, pacerIndex, words]);

  const last7Days = (() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days.push({ date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, label: d.toLocaleDateString('en-AU', { weekday: 'short' }) });
    }
    return days;
  })();

  const renderStoryText = () => {
    if (!storyData) return null;
    // Split by one or more newlines to handle paragraphs
    const paragraphs = storyData.text.split(/\n\s*\n/);
    let wordCounter = 0;

    return paragraphs.map((para, pIdx) => {
      const paraWords = para.trim().split(/\s+/);
      if (paraWords.length === 0 || (paraWords.length === 1 && paraWords[0] === "")) return null;
      
      return (
        <p key={pIdx} className="mb-8 last:mb-0">
          {paraWords.map((w, i) => {
            const currentIdx = wordCounter++;
            return (
              <span 
                key={i} 
                onClick={() => handleWordClick(w, currentIdx)} 
                className={`mr-3 inline-block cursor-pointer transition-all px-2 py-0.5 rounded-2xl ${pacerIndex === currentIdx ? 'bg-yellow-300 scale-110 shadow-lg text-black font-black ring-8 ring-yellow-100/50 z-20' : ''} ${flashingWordIndex === currentIdx ? 'bg-green-300 scale-125 shadow-2xl ring-8 ring-green-100 z-30' : ''} hover:bg-indigo-50`}
              >
                {w}
              </span>
            );
          })}
        </p>
      );
    });
  };

  if (appState === AppState.PROFILE_SELECTION) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
        {isInitializing ? <LoadingOverlay message="Preparing your room..." /> : (
          <>
            <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl lg:text-6xl font-black text-indigo-900 brand-font mb-16 text-center drop-shadow-sm z-10">Who's learning today?</motion.h1>
            <div className="flex flex-wrap gap-8 justify-center z-10">
              {PROFILES.map(p => (
                <motion.button key={p.id} whileHover={{ scale: 1.05, y: -8 }} whileTap={{ scale: 0.95 }} onClick={() => handleProfileSelect(p)} className="bg-white p-10 rounded-[48px] shadow-2xl border-4 border-transparent hover:border-indigo-400 w-64 md:w-72 text-center transition-all group">
                  <span className="text-8xl md:text-9xl mb-4 block filter drop-shadow-xl group-hover:scale-110 transition-transform duration-300">{p.avatar}</span>
                  <h2 className="text-3xl font-black text-slate-800 brand-font">{p.name}</h2>
                </motion.button>
              ))}
            </div>
            <motion.button whileHover={{ opacity: 1, scale: 1.1 }} onClick={() => { playClickSound(); setIsAdminOpen(true); }} className="mt-24 opacity-30 text-slate-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-indigo-600 transition-all z-10 group"><Settings2 size={16} /> Admin Entrance</motion.button>
            <AnimatePresence>{isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} onReset={handleResetApp} />}</AnimatePresence>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50/20 pb-20">
      <AnimatePresence>{appState === AppState.CELEBRATION && <CelebrationOverlay score={analysisResult?.score || 0} onComplete={() => setAppState(AppState.FEEDBACK)} />}</AnimatePresence>
      {currentUser && <Header user={currentUser} xp={xp} todayCount={todayCount} todayXp={todayXp} syncStatus={syncStatus} onShowStats={handleShowStats} onSwitchProfile={handleProfileSelect} />}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-4 mt-4">
        <AnimatePresence mode="wait">
          {appState === AppState.TOPIC_SELECTION && (
            <motion.div key="topics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-slate-800 mb-16 brand-font">Pick a story topic!</h2>
                <div className="flex bg-white p-2 rounded-2xl border border-indigo-50 max-w-md mx-auto">
                  {(['easy', 'medium', 'challenge'] as Difficulty[]).map(d => (
                    <button key={d} onClick={() => { playClickSound(); setDifficulty(d); }} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${difficulty === d ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}>{d.charAt(0).toUpperCase() + d.slice(1)}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{TOPICS.map(t => <TopicCard key={t.id} topic={t} onClick={() => handleTopicSelect(t)} />)}</div>
            </motion.div>
          )}
          {(appState === AppState.READING || appState === AppState.ANALYZING) && (
            <motion.div key="reading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 h-full">
              <div className="sticky top-24 z-40 bg-white p-3 md:p-6 rounded-[32px] shadow-lg border border-indigo-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 flex-1">
                    <Button variant="ghost" onClick={() => { playClickSound(); abortSpeakingSession(); setAppState(AppState.TOPIC_SELECTION); }} className="!px-3 md:!px-4 text-xs md:text-sm">← Exit</Button>
                    <Button variant="secondary" onClick={handleRefresh} icon={<RefreshCw size={18} className="md:w-5 md:h-5" />} className="!px-4 md:!px-6 !text-xs md:!text-sm !font-black !uppercase !tracking-wide">New Story</Button>
                    <div className="h-8 w-[2px] bg-slate-100 hidden sm:block"></div>
                    <div className="flex items-center gap-2 md:gap-3 bg-slate-50 px-3 md:px-5 py-2 md:py-2.5 rounded-2xl border border-slate-100 cursor-pointer select-none" onClick={() => { playClickSound(); setUseGuide(!useGuide); }}>
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex items-center justify-center ${useGuide ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                        {useGuide && <CheckSquare className="text-white" size={14} />}
                      </div>
                      <span className="font-black text-slate-700 text-xs md:text-sm uppercase">Guide</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        variant={isAudioPlaying ? "danger" : (prefetchError ? "ghost" : "secondary")} 
                        onClick={handleListenGuide} 
                        isLoading={isAudioLoading} 
                        icon={isAudioPlaying ? <HeadphoneOff size={18} className="md:w-5 md:h-5" /> : (prefetchError ? <AlertCircle size={18} className="md:w-5 md:h-5 text-amber-500" /> : <Headphones size={18} className="md:w-5 md:h-5" />)}
                        className={`!px-4 md:!px-6 !py-2 md:!py-2.5 !text-xs md:!text-sm !font-black !uppercase transition-all ${isAudioPlaying ? 'animate-pulse ring-4 ring-red-100' : ''}`}
                      >
                        <span>{isAudioPlaying ? "Stop" : "Listen"}</span>
                        <AnimatePresence mode="wait">
                          {isAudioPrefetching && (
                            <motion.div key="spinner" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="ml-1"><Loader2 size={14} className="md:w-4 md:h-4 animate-spin text-indigo-400" /></motion.div>
                          )}
                          {!isAudioPrefetching && !isAudioLoading && !isAudioPlaying && isAudioReady && !prefetchError && (
                            <motion.div key="check" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="ml-1"><CheckCircle2 size={14} className="md:w-4 md:h-4 text-emerald-500" /></motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-end w-full md:w-auto">
                     {isRecording ? (
                       <div className="flex gap-2 md:gap-3">
                         <Button variant="danger" onClick={stopRecording} icon={<Square size={20} className="md:w-[22px] md:h-[22px]" fill="currentColor" />} className="!px-6 md:!px-8 py-3 md:py-3.5 text-xs md:text-sm">FINISH</Button>
                         <Button variant="secondary" onClick={() => { playClickSound(); setIsPaused(!isPaused); }} icon={isPaused ? <PlayCircle size={20} className="md:w-[22px] md:h-[22px]" /> : <PauseCircle size={20} className="md:w-[22px] md:h-[22px]" />} className="py-3 md:py-3.5 text-xs md:text-sm px-4 md:px-6">{isPaused ? 'RESUME' : 'PAUSE'}</Button>
                       </div>
                     ) : (
                       <Button variant="primary" onClick={startRecording} className="!px-8 md:!px-12 !py-3 md:!py-4 !rounded-full shadow-2xl ring-4 ring-indigo-50 border-b-4 border-indigo-800 text-sm md:text-base" icon={<Mic size={22} className="md:w-[26px] md:h-[26px]" />}>START READING</Button>
                     )}
                  </div>
                </div>
              </div>
              <div className="relative flex flex-col bg-white rounded-[50px] shadow-2xl overflow-hidden min-h-[700px] book-shadow border border-indigo-50/50">
                <div className="relative bg-slate-100 h-[350px] md:h-[450px]">
                  {isImageLoading ? <div className="absolute inset-0 flex items-center justify-center shimmer"><p className="font-black text-indigo-400 animate-pulse brand-font text-2xl">Illustrating...</p></div> : storyImageUrl ? <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={storyImageUrl} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-200"><ImageIcon size={96} /></div>}
                </div>
                <div className="relative bg-white flex flex-col flex-1 min-h-0">
                  {isLoading ? <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12 lg:p-20"><Loader2 className="animate-spin text-indigo-300 w-12 h-12" /><p className="font-black text-indigo-900 brand-font text-3xl">Writing story...</p></div> : (
                    <div className="flex-1 p-10 md:p-14 lg:p-16">
                      <div className="text-2xl md:text-3xl lg:text-4xl leading-[1.8] md:leading-[2] font-medium text-slate-800 text-left tracking-tight max-w-5xl mx-auto">
                        {renderStoryText()}
                      </div>
                    </div>
                  )}
                  {isRecording && <div className="mt-auto p-8 pt-0 z-20"><div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[32px] border border-slate-100"><div className="w-6 h-6 rounded-full bg-red-500 animate-pulse" /><div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden"><motion.div className="h-full bg-indigo-500 rounded-full" animate={{ width: `${(micVolume / 255) * 100}%` }} /></div></div></div>}
                </div>
              </div>
              {appState === AppState.ANALYZING && <LoadingOverlay message="Analyzing..." />}
              {analysisError && <div className="text-indigo-700 text-center font-black bg-indigo-50 p-6 rounded-[32px] border-2 border-indigo-100 shadow-sm animate-bounce-short"><div className="flex items-center justify-center gap-3"><AlertCircle className="text-amber-500" />{analysisError}</div></div>}
            </motion.div>
          )}
          {appState === AppState.FEEDBACK && analysisResult && <ResultCard result={analysisResult} onRetry={() => setAppState(AppState.READING)} onHome={() => setAppState(AppState.TOPIC_SELECTION)} onStats={handleShowStats} />}
          {appState === AppState.STATS && (
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
              {isFetchingStats ? <LoadingOverlay message="Loading stats..." /> : (
                <>
                  <div className="flex justify-between items-center bg-white/50 p-6 rounded-[40px] border border-indigo-50"><h2 className="text-4xl font-black brand-font flex items-center gap-3"><TrendingUp size={32} />Sibling Challenge</h2><Button variant="ghost" onClick={() => setAppState(AppState.TOPIC_SELECTION)}>Back</Button></div>
                  <div className="bg-white p-10 rounded-[50px] border-2 border-indigo-50">
                     <div className="flex justify-between items-end mb-4"><div className="text-left"><span className="text-4xl">{PROFILES[0].avatar}</span> <span className="font-black text-2xl text-indigo-900">{PROFILES[0].name}</span><p className="text-indigo-600 font-bold">{Math.round(comparisonData.clara?.xp || 0)} XP</p></div><div className="text-right"><span className="font-black text-2xl text-orange-900">{PROFILES[1].name}</span> <span className="text-4xl">{PROFILES[1].avatar}</span><p className="text-orange-600 font-bold">{Math.round(comparisonData.edison?.xp || 0)} XP</p></div></div>
                     <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden flex"><motion.div className="h-full bg-indigo-500" animate={{ width: `${(comparisonData.clara?.xp / (comparisonData.clara?.xp + comparisonData.edison?.xp || 1)) * 100}%` }} /><motion.div className="h-full bg-orange-500" animate={{ width: `${(comparisonData.edison?.xp / (comparisonData.clara?.xp + comparisonData.edison?.xp || 1)) * 100}%` }} /></div>
                  </div>
                  <div className="bg-white p-8 md:p-12 rounded-[50px] border-2 border-indigo-50 overflow-x-auto"><h3 className="text-2xl font-black mb-8 flex items-center gap-2"><Star className="text-yellow-400 fill-yellow-400" />Weekly Tracker</h3><div className="min-w-[800px]"><div className="grid grid-cols-[150px_repeat(7,1fr)] gap-4 items-center mb-4 pb-4 border-b border-slate-100"><div></div>{last7Days.map(day => <div key={day.date} className="text-center"><span className="text-sm font-bold text-slate-600 uppercase">{day.label}</span></div>)}</div><div className="grid grid-cols-[150px_repeat(7,1fr)] gap-4 items-center mb-12"><div className="font-black text-indigo-900">Clara</div>{last7Days.map(day => <div key={day.date} className="flex justify-center"><AdaptiveProgressDots count={comparisonData.clara?.history?.[day.date] || 0} dailyXp={comparisonData.clara?.dailyXp?.[day.date] || 0} themeColor="indigo" isGoalDone={(comparisonData.clara?.history?.[day.date] || 0) >= getDailyTarget()} /></div>)}</div><div className="grid grid-cols-[150px_repeat(7,1fr)] gap-4 items-center"><div className="font-black text-orange-900">Edison</div>{last7Days.map(day => <div key={day.date} className="flex justify-center"><AdaptiveProgressDots count={comparisonData.edison?.history?.[day.date] || 0} dailyXp={comparisonData.edison?.dailyXp?.[day.date] || 0} themeColor="orange" isGoalDone={(comparisonData.edison?.history?.[day.date] || 0) >= getDailyTarget()} /></div>)}</div></div></div>
                </>
              )}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
