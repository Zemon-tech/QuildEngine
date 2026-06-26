import { createFileRoute } from "@tanstack/react-router";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  BookOpen,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "#/components/admin/empty-state";
import { PageHeader } from "#/components/admin/page-header";
import { StatusBadge } from "#/components/admin/status-badge";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { cn } from "#/lib/utils";

interface Course {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  difficulty: string;
  lessons: number;
  students: number;
  status: string;
  category: string;
}

// Mock courses data
const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Complete Data Structures & Algorithms",
    slug: "dsa-complete",
    instructor: "Dr. Emily Smith",
    difficulty: "Beginner",
    lessons: 48,
    students: 2843,
    status: "active",
    category: "Computer Science",
  },
  {
    id: "2",
    title: "Advanced System Design Interview Prep",
    slug: "system-design-advanced",
    instructor: "Alex Rivera",
    difficulty: "Advanced",
    lessons: 24,
    students: 1205,
    status: "active",
    category: "Software Eng",
  },
  {
    id: "3",
    title: "Mastering React 19 & Next.js 15",
    slug: "react-next-mastery",
    instructor: "Jessica Zhang",
    difficulty: "Intermediate",
    lessons: 36,
    students: 954,
    status: "active",
    category: "Web Development",
  },
  {
    id: "4",
    title: "Introduction to Machine Learning with PyTorch",
    slug: "pytorch-intro",
    instructor: "David Miller",
    difficulty: "Intermediate",
    lessons: 18,
    students: 512,
    status: "pending",
    category: "Data Science",
  },
  {
    id: "5",
    title: "Rust Programming Crash Course",
    slug: "rust-crash-course",
    instructor: "Marcus Vester",
    difficulty: "Beginner",
    lessons: 15,
    students: 0,
    status: "suspended",
    category: "Systems",
  },
];

export const Route = createFileRoute("/_admin/courses/")({
  component: CoursesPage,
});

function CoursesPage() {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase());
      const matchDiff = !diffFilter || c.difficulty === diffFilter;
      const matchStatus =
        !statusFilter ||
        (statusFilter === "published" && c.status === "active") ||
        (statusFilter === "draft" && c.status === "pending") ||
        (statusFilter === "archived" && c.status === "suspended");
      return matchSearch && matchDiff && matchStatus;
    });
  }, [courses, search, diffFilter, statusFilter]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const columns = useMemo<ColumnDef<Course>[]>(
    () => [
      {
        id: "course",
        header: "Course",
        accessorFn: (row) => `${row.title} ${row.slug}`,
        cell: ({ row }) => {
          const course = row.original;
          return (
            <div className="flex items-center gap-3">
              <span
                className="flex size-8 items-center justify-center rounded-lg border text-sm"
                style={{
                  background:
                    "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                  borderColor: "var(--sb-border)",
                  color: "var(--sb-ink-muted)",
                }}
              >
                <BookOpen size={14} />
              </span>
              <div className="flex flex-col">
                <span
                  className="font-semibold"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {course.title}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  /{course.slug}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "instructor",
        header: "Instructor",
        cell: ({ getValue }) => (
          <span style={{ color: "var(--sb-ink-muted)" }}>
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ getValue }) => (
          <span style={{ color: "var(--sb-ink-muted)" }}>
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "difficulty",
        header: "Difficulty",
        cell: ({ getValue }) => {
          const diff = getValue<string>();
          return (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide capitalize",
                diff === "Beginner" && "bg-green-500/10 text-green-500",
                diff === "Intermediate" && "bg-amber-500/10 text-amber-500",
                diff === "Advanced" && "bg-red-500/10 text-red-500",
              )}
            >
              {diff}
            </span>
          );
        },
      },
      {
        accessorKey: "lessons",
        header: () => <div className="text-center">Lessons</div>,
        cell: ({ getValue }) => (
          <div
            className="text-center font-medium"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            {getValue<number>()}
          </div>
        ),
      },
      {
        accessorKey: "students",
        header: () => <div className="text-center">Students</div>,
        cell: ({ getValue }) => (
          <div
            className="text-center font-medium"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            {getValue<number>().toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => (
          <StatusBadge
            status={getValue<"active" | "pending" | "suspended">()}
          />
        ),
      },
      {
        id: "actions",
        cell: ({ row, table }) => {
          const course = row.original;
          const meta = table.options.meta as
            | { handleDelete: (id: string) => void }
            | undefined;
          return (
            <div className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex size-7 items-center justify-center rounded-[7px] outline-none cursor-pointer transition-all duration-100 hover:bg-(--sb-bg-hover) active:scale-95 mx-auto"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44"
                  style={{
                    background: "var(--sb-bg)",
                    border: "1px solid var(--sb-border)",
                  }}
                >
                  <DropdownMenuItem className="text-xs cursor-pointer gap-2">
                    <Eye size={12} />
                    View Course
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs cursor-pointer gap-2">
                    <Edit size={12} />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-xs cursor-pointer gap-2 text-red-500"
                    onClick={() => meta?.handleDelete(course.id)}
                  >
                    <Trash size={12} />
                    Delete Course
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      handleDelete,
    },
  });

  return (
    <div className="p-6 w-full pb-16">
      <PageHeader
        title="Courses"
        description={`${courses.length} learning courses available.`}
        icon={BookOpen}
        breadcrumbs={[{ label: "Admin" }, { label: "Courses" }]}
        actions={[
          {
            label: "New Course",
            to: "/courses/new",
            icon: Plus,
            variant: "default",
          },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--sb-ink-dim)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses…"
            className={cn(
              "pl-8 pr-3 py-2 text-xs rounded-[10px] outline-none w-56 transition-all duration-150",
              "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/30",
            )}
            style={{
              background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
              border: "1px solid var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5">
          {[null, "Beginner", "Intermediate", "Advanced"].map((diff) => (
            <button
              key={diff ?? "all"}
              type="button"
              onClick={() => setDiffFilter(diff)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-150 cursor-pointer active:scale-95",
              )}
              style={{
                background:
                  diffFilter === diff
                    ? "color-mix(in oklab, var(--sb-ink) 10%, transparent)"
                    : "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                border: "1px solid var(--sb-border)",
                color:
                  diffFilter === diff ? "var(--sb-ink)" : "var(--sb-ink-muted)",
              }}
            >
              {diff ?? "All Difficulties"}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          {[null, "published", "draft", "archived"].map((status) => (
            <button
              key={status ?? "all"}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-150 capitalize cursor-pointer active:scale-95",
              )}
              style={{
                background:
                  statusFilter === status
                    ? "color-mix(in oklab, var(--sb-ink) 10%, transparent)"
                    : "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                border: "1px solid var(--sb-border)",
                color:
                  statusFilter === status
                    ? "var(--sb-ink)"
                    : "var(--sb-ink-muted)",
              }}
            >
              {status ?? "All Statuses"}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="Try adjusting your search query or filters."
          action={{
            label: "Clear filters",
            onClick: () => {
              setSearch("");
              setDiffFilter(null);
              setStatusFilter(null);
            },
          }}
        />
      ) : (
        <div className="island-shell rounded-xl overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  style={{
                    borderBottom: "1px solid var(--sb-border)",
                    background:
                      "color-mix(in oklab, var(--sb-ink) 2%, transparent)",
                  }}
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-semibold uppercase tracking-wider"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[color-mix(in_oklab,var(--sb-ink)_1.5%,transparent)] transition-colors duration-100"
                  style={{ borderBottom: "1px solid var(--sb-border)" }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
