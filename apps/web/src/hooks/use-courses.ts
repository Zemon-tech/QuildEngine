import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockCourses } from "#/lib/learn-db";

function getLocalStorageState() {
  if (typeof window === "undefined") {
    return {
      enrolled: mockCourses.filter((c) => c.enrolled).map((c) => c.id),
      progress: {},
    };
  }

  let enrolled = localStorage.getItem("quild_enrolled_courses");
  let progress = localStorage.getItem("quild_course_progress");

  if (!enrolled) {
    const initialEnrolled = mockCourses
      .filter((c) => c.enrolled)
      .map((c) => c.id);
    localStorage.setItem(
      "quild_enrolled_courses",
      JSON.stringify(initialEnrolled),
    );
    enrolled = JSON.stringify(initialEnrolled);
  }

  if (!progress) {
    const initialProgress: Record<
      string,
      { completedLessons: string[]; progressPercent: number }
    > = {};
    for (const course of mockCourses) {
      if (course.enrolled) {
        // Find some completed lessons to match initial progress percent
        const allLessons = course.modules.flatMap((m) => m.lessons);
        const countToComplete = Math.round(
          (course.progress / 100) * allLessons.length,
        );
        const completed = allLessons.slice(0, countToComplete).map((l) => l.id);
        initialProgress[course.id] = {
          completedLessons: completed,
          progressPercent: course.progress,
        };
      } else {
        initialProgress[course.id] = {
          completedLessons: [],
          progressPercent: 0,
        };
      }
    }
    localStorage.setItem(
      "quild_course_progress",
      JSON.stringify(initialProgress),
    );
    progress = JSON.stringify(initialProgress);
  }

  return {
    enrolled: JSON.parse(enrolled) as string[],
    progress: JSON.parse(progress) as Record<
      string,
      { completedLessons: string[]; progressPercent: number }
    >,
  };
}

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const state = getLocalStorageState();
      return mockCourses.map((course) => {
        const isEnrolled = state.enrolled.includes(course.id);
        const progressData = state.progress[course.id] || {
          completedLessons: [],
          progressPercent: 0,
        };
        const allLessons = course.modules.flatMap((m) => m.lessons);
        const total = allLessons.length;
        const completed = progressData.completedLessons.length;
        const calculatedPercent =
          total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          ...course,
          enrolled: isEnrolled,
          progress: calculatedPercent,
          completedLessons: completed,
          totalLessons: total,
        };
      });
    },
    staleTime: 300_000,
  });
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ["courses", courseId],
    queryFn: async () => {
      const course = mockCourses.find((c) => c.id === courseId);
      if (!course) throw new Error("Course not found");

      const state = getLocalStorageState();
      const isEnrolled = state.enrolled.includes(course.id);
      const progressData = state.progress[course.id] || {
        completedLessons: [],
        progressPercent: 0,
      };

      const allLessons = course.modules.flatMap((m) => m.lessons);
      const total = allLessons.length;
      const completed = progressData.completedLessons.length;
      const calculatedPercent =
        total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        ...course,
        enrolled: isEnrolled,
        progress: calculatedPercent,
        completedLessonsCount: completed,
        completedLessonIds: progressData.completedLessons,
        totalLessons: total,
      };
    },
    staleTime: 300_000,
    enabled: !!courseId,
  });
}

export function useEnrollInCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const state = getLocalStorageState();
      if (!state.enrolled.includes(courseId)) {
        state.enrolled.push(courseId);
        localStorage.setItem(
          "quild_enrolled_courses",
          JSON.stringify(state.enrolled),
        );

        state.progress[courseId] = {
          completedLessons: [],
          progressPercent: 0,
        };
        localStorage.setItem(
          "quild_course_progress",
          JSON.stringify(state.progress),
        );
      }
      return courseId;
    },
    onSuccess: (courseId) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
    },
  });
}

export function useToggleLessonCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    }) => {
      const state = getLocalStorageState();
      const course = mockCourses.find((c) => c.id === courseId);
      if (!course) throw new Error("Course not found");

      if (!state.progress[courseId]) {
        state.progress[courseId] = { completedLessons: [], progressPercent: 0 };
      }

      const completed = [...state.progress[courseId].completedLessons];
      const index = completed.indexOf(lessonId);

      if (index > -1) {
        completed.splice(index, 1);
      } else {
        completed.push(lessonId);
      }

      const allLessons = course.modules.flatMap((m) => m.lessons);
      const total = allLessons.length;
      const progressPercent =
        total > 0 ? Math.round((completed.length / total) * 100) : 0;

      state.progress[courseId] = {
        completedLessons: completed,
        progressPercent,
      };

      localStorage.setItem(
        "quild_course_progress",
        JSON.stringify(state.progress),
      );
      return { courseId, lessonId, completed };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", data.courseId] });
    },
  });
}

// ─── Bookmarks State Helpers ───────────────────────────────────────────────────

export interface BookmarkedLesson {
  courseId: string;
  moduleId: string;
  lessonId: string;
  title: string;
  courseTitle: string;
}

export function getLocalStorageBookmarks() {
  if (typeof window === "undefined") {
    return { courses: [] as string[], lessons: [] as BookmarkedLesson[] };
  }

  const courses = localStorage.getItem("quild_bookmarked_courses");
  const lessons = localStorage.getItem("quild_bookmarked_lessons");

  return {
    courses: courses ? (JSON.parse(courses) as string[]) : [],
    lessons: lessons ? (JSON.parse(lessons) as BookmarkedLesson[]) : [],
  };
}

export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      return getLocalStorageBookmarks();
    },
    staleTime: 60_000,
  });
}

export function useToggleCourseBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const state = getLocalStorageBookmarks();
      const idx = state.courses.indexOf(courseId);

      if (idx > -1) {
        state.courses.splice(idx, 1);
      } else {
        state.courses.push(courseId);
      }

      localStorage.setItem(
        "quild_bookmarked_courses",
        JSON.stringify(state.courses),
      );
      return state;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useToggleLessonBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lesson: BookmarkedLesson) => {
      const state = getLocalStorageBookmarks();
      const idx = state.lessons.findIndex(
        (l) => l.lessonId === lesson.lessonId,
      );

      if (idx > -1) {
        state.lessons.splice(idx, 1);
      } else {
        state.lessons.push(lesson);
      }

      localStorage.setItem(
        "quild_bookmarked_lessons",
        JSON.stringify(state.lessons),
      );
      return state;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
