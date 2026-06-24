import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoadmapsList, fetchRoadmapDetail, updateNodeProgress, toggleNodeBookmark, toggleRoadmapFavorite } from "../lib/server-fns/roadmaps";
import type { UserProgress, NodeStatus, RoadmapCategory, Achievement } from "../types/roadmaps";
import { useEffect, useState } from "react";
import { produce } from "immer";

const LOCAL_STORAGE_KEY = "quild_roadmap_progress";

const DEFAULT_USER_PROGRESS: UserProgress = {
  completedNodes: [],
  bookmarkedNodes: [],
  favorites: [],
  xpPoints: 0,
  learningStreak: 1,
  lastVisitedNode: null,
  activeRoadmaps: {},
};

// Helper to load LocalStorage progress
const loadLocalProgress = (): UserProgress => {
  if (typeof window === "undefined") return DEFAULT_USER_PROGRESS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_USER_PROGRESS;
  } catch (e) {
    console.error("Failed to read LocalStorage progress", e);
    return DEFAULT_USER_PROGRESS;
  }
};

// Helper to save LocalStorage progress
const saveLocalProgress = (progress: UserProgress) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save LocalStorage progress", e);
  }
};

export function useRoadmaps() {
  const queryClient = useQueryClient();
  const [localProgress, setLocalProgress] = useState<UserProgress>(loadLocalProgress);

  // Sync state with LocalStorage inside client
  useEffect(() => {
    saveLocalProgress(localProgress);
  }, [localProgress]);

  // Fetch index (categories, achievements, progress)
  const indexQuery = useQuery({
    queryKey: ["roadmaps", "index"],
    queryFn: async () => {
      const res = await fetchRoadmapsList();
      return res;
    },
    staleTime: 60_000,
  });

  // Derived progress: combines BFF server values with LocalStorage backup
  const progress: UserProgress = indexQuery.data?.progress.xpPoints
    ? indexQuery.data.progress
    : localProgress;

  // Derived categories: maps category progression percentages
  const categories: RoadmapCategory[] = (indexQuery.data?.categories ?? []).map((cat) => {
    const percent = progress.activeRoadmaps[cat.id] ?? 0;
    return {
      ...cat,
      progress: percent,
    };
  });

  // Derived achievements: maps achievements unlock statuses
  const achievements: Achievement[] = indexQuery.data?.achievements ?? [];

  // Toggle Node Completion Status Mutation
  const completeNodeMutation = useMutation({
    mutationFn: async ({
      nodeId,
      roadmapId,
      status,
    }: {
      nodeId: string;
      roadmapId: string;
      status: NodeStatus;
    }) => {
      // Send the current active progress to BFF for calculation
      const nextStatus = status === "completed" ? "completed" : "not_started";
      const result = await updateNodeProgress({
        data: {
          nodeId,
          roadmapId,
          status: nextStatus,
          currentProgress: progress,
        },
      });
      return { ...result, nodeId, roadmapId, nextStatus };
    },
    onMutate: async (variables) => {
      // Optimistic updates inside query cache using Immer
      await queryClient.cancelQueries({ queryKey: ["roadmaps", "index"] });
      
      const previousIndex = queryClient.getQueryData(["roadmaps", "index"]);

      // Update LocalStorage optimistically
      setLocalProgress((prev) =>
        produce(prev, (draft) => {
          const wasCompleted = draft.completedNodes.includes(variables.nodeId);
          if (variables.status === "completed" && !wasCompleted) {
            draft.completedNodes.push(variables.nodeId);
            draft.lastVisitedNode = variables.nodeId;
          } else if (variables.status !== "completed" && wasCompleted) {
            draft.completedNodes = draft.completedNodes.filter((id) => id !== variables.nodeId);
          }
          
          // Basic local estimation of active roadmap percentage
          // Detail calculations will sync accurately with the server response
          const count = draft.completedNodes.filter((id) => id.startsWith(variables.roadmapId.substring(0, 3))).length;
          draft.activeRoadmaps[variables.roadmapId] = Math.min(100, Math.round(count * 15));
        })
      );

      return { previousIndex };
    },
    onSuccess: (data) => {
      // Server returned updated computed progress and achievements
      setLocalProgress(data.progress);
      
      // Update TanStack Query cache with latest validated server values
      queryClient.setQueryData(["roadmaps", "index"], (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          progress: data.progress,
          achievements: data.achievements,
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps", "index"] });
    },
  });

  // Toggle Node Bookmark Mutation
  const bookmarkMutation = useMutation({
    mutationFn: async ({ nodeId }: { nodeId: string }) => {
      const result = await toggleNodeBookmark({
        data: {
          nodeId,
          currentProgress: progress,
        },
      });
      return result;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["roadmaps", "index"] });
      const previousIndex = queryClient.getQueryData(["roadmaps", "index"]);

      setLocalProgress((prev) =>
        produce(prev, (draft) => {
          const isBookmarked = draft.bookmarkedNodes.includes(variables.nodeId);
          if (isBookmarked) {
            draft.bookmarkedNodes = draft.bookmarkedNodes.filter((id) => id !== variables.nodeId);
          } else {
            draft.bookmarkedNodes.push(variables.nodeId);
          }
        })
      );

      return { previousIndex };
    },
    onSuccess: (data) => {
      setLocalProgress(data.progress);
      queryClient.setQueryData(["roadmaps", "index"], (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          progress: data.progress,
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps", "index"] });
    },
  });

  // Toggle Roadmap Favorite Mutation
  const favoriteMutation = useMutation({
    mutationFn: async ({ roadmapId }: { roadmapId: string }) => {
      const result = await toggleRoadmapFavorite({
        data: {
          roadmapId,
          currentProgress: progress,
        },
      });
      return result;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["roadmaps", "index"] });
      const previousIndex = queryClient.getQueryData(["roadmaps", "index"]);

      setLocalProgress((prev) =>
        produce(prev, (draft) => {
          if (!draft.favorites) {
            draft.favorites = [];
          }
          const isFavorite = draft.favorites.includes(variables.roadmapId);
          if (isFavorite) {
            draft.favorites = draft.favorites.filter((id) => id !== variables.roadmapId);
          } else {
            draft.favorites.push(variables.roadmapId);
          }
        })
      );

      return { previousIndex };
    },
    onSuccess: (data) => {
      setLocalProgress(data.progress);
      queryClient.setQueryData(["roadmaps", "index"], (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          progress: data.progress,
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps", "index"] });
    },
  });

  return {
    isLoading: indexQuery.isLoading,
    isError: indexQuery.isError,
    categories,
    achievements,
    progress,
    toggleNodeCompletion: (nodeId: string, roadmapId: string, status: NodeStatus) => {
      completeNodeMutation.mutate({ nodeId, roadmapId, status });
    },
    toggleNodeBookmark: (nodeId: string) => {
      bookmarkMutation.mutate({ nodeId });
    },
    toggleRoadmapFavorite: (roadmapId: string) => {
      favoriteMutation.mutate({ roadmapId });
    },
  };
}

export function useRoadmapDetail(roadmapId?: string) {
  return useQuery({
    queryKey: ["roadmaps", "detail", roadmapId],
    queryFn: async () => {
      if (!roadmapId) return null;
      const res = await fetchRoadmapDetail({ data: roadmapId });
      return res;
    },
    enabled: !!roadmapId,
    staleTime: 300_000,
  });
}
