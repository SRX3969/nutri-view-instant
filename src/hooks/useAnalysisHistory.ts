import { useState, useEffect } from "react";

export interface AnalysisData {
  id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  foodType: string;
  tips: string[];
  imageUrl: string;
  timestamp: number;
}

const STORAGE_KEY = "nutrilens-history";

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisData[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  const saveAnalysis = (data: Omit<AnalysisData, "id" | "timestamp">) => {
    const newEntry: AnalysisData = {
      ...data,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...history];
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEntry.id;
  };

  const deleteAnalysis = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getAnalysis = (id: string) => {
    return history.find((item) => item.id === id);
  };

  return { history, saveAnalysis, deleteAnalysis, getAnalysis };
}
