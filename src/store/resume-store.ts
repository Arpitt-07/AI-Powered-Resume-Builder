import { create } from 'zustand';
import { IResume } from '@/types/resume.types';

interface ResumeState {
  resumeData: Partial<IResume>;
  sectionOrder: string[];
  history: Partial<IResume>[];
  historyPointer: number;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  activeSection: string | null;

  setResumeData: (data: Partial<IResume>, saveToHistory?: boolean) => void;
  setSectionOrder: (order: string[]) => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'success' | 'error') => void;
  setActiveSection: (sectionId: string | null) => void;
  moveSection: (startIndex: number, endIndex: number) => void;
  moveItem: (section: string, startIndex: number, endIndex: number) => void;
  undo: () => void;
  redo: () => void;
}

const MAX_HISTORY = 50;

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumeData: {},
  sectionOrder: ['general', 'personal', 'workExperience', 'education', 'projects', 'skills'],
  history: [],
  historyPointer: -1,
  saveStatus: 'idle',
  activeSection: null,

  setResumeData: (data, saveToHistory = true) => {
    const currentData = get().resumeData;

    if (saveToHistory) {
      const { history, historyPointer } = get();
      const newHistory = history.slice(0, historyPointer + 1);

      if (JSON.stringify(currentData) !== JSON.stringify(data)) {
        newHistory.push(currentData);
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }
        set({
          resumeData: data,
          history: newHistory,
          historyPointer: newHistory.length - 1
        });
      } else {
        set({ resumeData: data });
      }
    } else {
      set({ resumeData: data });
    }
  },

  setSectionOrder: (order) => {
    set({ sectionOrder: order });
  },

  setSaveStatus: (status) => {
    set({ saveStatus: status });
  },

  setActiveSection: (sectionId) => {
    set({ activeSection: sectionId });
  },

  moveSection: (startIndex, endIndex) => {
    const { sectionOrder } = get();
    const result = Array.from(sectionOrder);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    set({ sectionOrder: result });
  },

  moveItem: (section, startIndex, endIndex) => {
    const { resumeData } = get();
    const newData = { ...resumeData };
    const list = (newData[section as keyof IResume] as any[]) || [];
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    (newData as any)[section] = result;
    set({ resumeData: newData });
  },

  undo: () => {
    const { history, historyPointer } = get();
    if (historyPointer < 0) return;

    const previousState = history[historyPointer];
    set({
      resumeData: previousState,
      historyPointer: historyPointer - 1
    });
  },

  redo: () => {
    const { history, historyPointer } = get();
    if (historyPointer >= history.length) return;

    const nextState = history[historyPointer + 1];
    if (!nextState) return;

    set({
      resumeData: nextState,
      historyPointer: historyPointer + 1
    });
  },
}));
