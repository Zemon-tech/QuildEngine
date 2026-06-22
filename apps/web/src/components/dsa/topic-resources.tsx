import { motion } from "framer-motion";
import {
  Bookmark,
  BookOpen,
  ChevronRight,
  FileText,
  PlayCircle,
} from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "Notes" | "Cheatsheet" | "Video Lecture" | "Article" | "Revision Notes";
}

interface TopicResourcesProps {
  topicId: string;
}

const resourcesMap: Record<string, ResourceItem[]> = {
  arrays: [
    {
      id: "arr-res-1",
      title: "Arrays Memory Layout & Contiguous Storage",
      duration: "10 mins read",
      difficulty: "Beginner",
      type: "Notes",
    },
    {
      id: "arr-res-2",
      title: "Complete Arrays Pattern Cheatsheet",
      duration: "5 mins read",
      difficulty: "Beginner",
      type: "Cheatsheet",
    },
    {
      id: "arr-res-3",
      title: "Mastering Sliding Window & Two Pointers",
      duration: "45 mins video",
      difficulty: "Intermediate",
      type: "Video Lecture",
    },
    {
      id: "arr-res-4",
      title: "Prefix Sum & Subarray Math Tricks",
      duration: "15 mins read",
      difficulty: "Intermediate",
      type: "Article",
    },
    {
      id: "arr-res-5",
      title: "Revision Guide: Must-Solve Matrix Patterns",
      duration: "8 mins read",
      difficulty: "Advanced",
      type: "Revision Notes",
    },
  ],
  strings: [
    {
      id: "str-res-1",
      title: "String Immutability & Substring Slicing Memory",
      duration: "8 mins read",
      difficulty: "Beginner",
      type: "Notes",
    },
    {
      id: "str-res-2",
      title: "Knuth-Morris-Pratt (KMP) Algorithm Demystified",
      duration: "35 mins video",
      difficulty: "Advanced",
      type: "Video Lecture",
    },
  ],
};

export function TopicResources({ topicId }: TopicResourcesProps) {
  const list = resourcesMap[topicId] || [
    {
      id: "fallback-res-1",
      title: "Core Data Structure Fundamentals",
      duration: "12 mins read",
      difficulty: "Beginner",
      type: "Notes",
    },
    {
      id: "fallback-res-2",
      title: "Interview Pattern Revision Cheatsheet",
      duration: "6 mins read",
      difficulty: "Intermediate",
      type: "Cheatsheet",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "Video Lecture":
        return PlayCircle;
      case "Cheatsheet":
        return Bookmark;
      case "Article":
        return BookOpen;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto w-full">
      <div
        className="flex items-center justify-between border-b pb-3"
        style={{ borderColor: "var(--sb-border)" }}
      >
        <div>
          <h3 className="font-bold text-sm" style={{ color: "var(--sb-ink)" }}>
            Premium Study Resources
          </h3>
          <p className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>
            High-quality notes, video courses, and cheatsheets to review before
            practicing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.map((item, idx) => {
          const Icon = getIcon(item.type);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: idx * 0.05,
                type: "spring",
                stiffness: 220,
                damping: 20,
              }}
              whileHover={{ y: -2 }}
              className="rounded-2xl border p-4.5 flex flex-col justify-between hover:shadow-sm cursor-pointer select-none transition-all group"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="space-y-3">
                {/* Header: Type and Level */}
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-lg px-2 py-0.5 text-[9px] font-bold"
                    style={{
                      background: "oklch(1 0 0 / 0.04)",
                      border: "1px solid oklch(1 0 0 / 0.08)",
                      color: "var(--sb-ink-dim)",
                    }}
                  >
                    {item.type}
                  </span>

                  <span
                    className={`text-[9px] font-bold ${
                      item.difficulty === "Beginner"
                        ? "text-emerald-500"
                        : item.difficulty === "Intermediate"
                          ? "text-amber-500"
                          : "text-rose-500"
                    }`}
                  >
                    {item.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h4
                  className="font-bold text-[13px] group-hover:text-[var(--sb-accent)] transition-colors leading-snug"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {item.title}
                </h4>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between mt-4 border-t pt-3"
                style={{ borderColor: "var(--sb-border)" }}
              >
                <span
                  className="text-[10px] font-medium flex items-center gap-1"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  <Icon size={12} className="text-[var(--sb-accent)]" />
                  {item.duration}
                </span>

                <span className="text-[10px] font-bold text-[var(--sb-accent)] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Access material
                  <ChevronRight size={12} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
