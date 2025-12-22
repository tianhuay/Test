
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, increment, deleteDoc } from "firebase/firestore";

const DAILY_TARGET = 3;
const LOCAL_STORAGE_KEY = 'speaking_coach_data';

// Global flag to prevent repeated timeouts during a session
let isOfflineMode = false;

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const clearOfflineMode = () => {
  isOfflineMode = false;
};

export interface UserProgress {
  xp: number;
  history: Record<string, number>; // date -> count
  dailyXp?: Record<string, number>; // date -> xp
}

// --- Local Storage Helpers ---

const getLocalData = (userId: string): UserProgress | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw);
    const userData = all[userId];
    
    // Validate structure to prevent crashes
    if (userData) {
      if (typeof userData.xp !== 'number') userData.xp = 0;
      if (!userData.history || typeof userData.history !== 'object') userData.history = {};
      if (!userData.dailyXp || typeof userData.dailyXp !== 'object') userData.dailyXp = {};
    }
    
    return userData || null;
  } catch (e) {
    console.warn("Local storage access failed", e);
    return null;
  }
};

const saveLocalData = (userId: string, data: UserProgress) => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[userId] = data;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn("Local storage save failed", e);
  }
};

export const clearAllLocalData = () => {
  try {
    // Nuclear option: wipe ALL local storage for this domain
    localStorage.clear();
    sessionStorage.clear();
    console.log("Storage wiped clean.");
  } catch (e) {
    console.error("Critical storage wipe failure:", e);
  }
};

// --- Main Service Functions ---

interface UserDataResponse {
  data: UserProgress;
  fromCloud: boolean;
}

export const initUser = async (userId: string): Promise<UserDataResponse> => {
  const localData = getLocalData(userId);
  const defaultData: UserProgress = { xp: 0, history: {}, dailyXp: {} };

  if (isOfflineMode) {
    return { data: localData || defaultData, fromCloud: false };
  }

  const fetchCloud = async (): Promise<UserDataResponse> => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const cloudData: UserProgress = {
          xp: data.xp || 0,
          history: data.history || {},
          dailyXp: data.dailyXp || {}
        };

        if (localData && localData.xp > cloudData.xp) {
           setDoc(userRef, {
             xp: localData.xp,
             history: localData.history,
             dailyXp: localData.dailyXp
           }, { merge: true }).catch(() => {});
           return { data: localData, fromCloud: true }; 
        }

        saveLocalData(userId, cloudData);
        return { data: cloudData, fromCloud: true };
      } else {
        const initialData = localData || defaultData;
        await setDoc(userRef, initialData);
        saveLocalData(userId, initialData);
        return { data: initialData, fromCloud: true };
      }
    } catch (error) {
      throw error;
    }
  };

  const timeout = new Promise<UserDataResponse>((_, reject) => 
    setTimeout(() => reject(new Error("Connection timed out")), 2000)
  );

  try {
    return await Promise.race([fetchCloud(), timeout]);
  } catch (error) {
    isOfflineMode = true;
    return { data: localData || defaultData, fromCloud: false };
  }
};

export const fetchUserData = async (userId: string): Promise<{ xp: number, todayCount: number, todayXp: number, history: Record<string, number>, dailyXp: Record<string, number>, fromCloud: boolean }> => {
  try {
    const { data, fromCloud } = await initUser(userId);
    const today = getTodayDateString();
    const safeData = data || { xp: 0, history: {}, dailyXp: {} };
    const safeHistory = safeData.history || {};
    const safeDailyXp = safeData.dailyXp || {};

    return {
      xp: safeData.xp || 0,
      todayCount: safeHistory[today] || 0,
      todayXp: safeDailyXp[today] || 0,
      history: safeHistory,
      dailyXp: safeDailyXp,
      fromCloud
    };
  } catch (e) {
    return { xp: 0, todayCount: 0, todayXp: 0, history: {}, dailyXp: {}, fromCloud: false };
  }
};

export const incrementDailyProgress = async (userId: string, xpGain: number): Promise<{ newCount: number, newTodayXp: number, targetReached: boolean }> => {
  const today = getTodayDateString();
  const currentData = getLocalData(userId) || { xp: 0, history: {}, dailyXp: {} };
  
  const currentCount = (currentData.history[today] || 0) + 1;
  if (!currentData.dailyXp) currentData.dailyXp = {};
  const newTodayXp = (currentData.dailyXp[today] || 0) + xpGain;
  
  currentData.xp += xpGain;
  currentData.history[today] = currentCount;
  currentData.dailyXp[today] = newTodayXp;
  
  saveLocalData(userId, currentData);

  if (!isOfflineMode) {
    const userRef = doc(db, "users", userId);
    setDoc(userRef, {
      xp: increment(xpGain),
      history: { [today]: currentCount },
      dailyXp: { [today]: newTodayXp }
    }, { merge: true }).catch(() => {
      isOfflineMode = true;
    });
  }

  return { newCount: currentCount, newTodayXp, targetReached: currentCount === DAILY_TARGET };
};

export const resetUserData = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    return true;
  } catch (e) {
    console.error(`Failed to delete cloud data for ${userId}:`, e);
    return false;
  }
};

export const getDailyTarget = () => DAILY_TARGET;
