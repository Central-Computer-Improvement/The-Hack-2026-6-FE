import { create } from 'zustand';
import { progressApi } from '@/lib/api';

export interface ProgressRecord {
  id: number;
  user_id: string;
  course_id: string;
  module_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number | null;
  completed_at?: string | null;
  created_at?: string;
}

export interface SubjectMasteryStat {
  course_id: string;
  completedCount: number;
  totalCount: number;
  masteryPercentage: number;
}

interface ProgressState {
  progressList: ProgressRecord[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserProgress: (userId: string) => Promise<void>;
  recordProgress: (
    userId: string,
    courseId: string,
    moduleId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    score?: number
  ) => Promise<void>;

  // Computed Helpers
  getCompletedCount: () => number;
  getCourseMasteryStats: () => Record<string, SubjectMasteryStat>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressList: [],
  isLoading: false,
  error: null,

  fetchUserProgress: async (userId: string) => {
    if (!userId) return;
    set({ isLoading: true, error: null });
    try {
      const data = await progressApi.getProgress({ user_id: userId });
      set({ progressList: Array.isArray(data) ? (data as unknown as ProgressRecord[]) : [], isLoading: false });
    } catch (err: any) {
      console.error('Failed to fetch user progress:', err);
      set({ isLoading: false, error: err.message || 'Failed to fetch progress' });
    }
  },

  recordProgress: async (userId, courseId, moduleId, status, score) => {
    set({ isLoading: true, error: null });
    try {
      await progressApi.recordProgress({
        user_id: userId,
        course_id: courseId,
        module_id: moduleId,
        status,
        score,
      });
      // Refresh progress list
      await get().fetchUserProgress(userId);
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to record progress' });
      throw err;
    }
  },

  getCompletedCount: () => {
    return get().progressList.filter((p) => p.status === 'completed').length;
  },

  getCourseMasteryStats: () => {
    const list = get().progressList;
    const stats: Record<string, SubjectMasteryStat> = {};

    list.forEach((record) => {
      const cid = record.course_id;
      if (!stats[cid]) {
        stats[cid] = {
          course_id: cid,
          completedCount: 0,
          totalCount: 0,
          masteryPercentage: 0,
        };
      }
      stats[cid].totalCount += 1;
      if (record.status === 'completed') {
        stats[cid].completedCount += 1;
      }
    });

    Object.values(stats).forEach((item) => {
      if (item.totalCount > 0) {
        item.masteryPercentage = Math.round(
          (item.completedCount / item.totalCount) * 100
        );
      }
    });

    return stats;
  },
}));
