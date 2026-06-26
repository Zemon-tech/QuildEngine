import { createFileRoute } from "@tanstack/react-router";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Plus, Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "#/components/admin/empty-state";
import { PageHeader } from "#/components/admin/page-header";
import { StatusBadge } from "#/components/admin/status-badge";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { cn } from "#/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  lastActive: string;
}

// Mock data — will be replaced by fetchUsers() SSR loader
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    username: "sarah_c",
    role: "admin",
    status: "active",
    createdAt: "Jan 12, 2025",
    lastActive: "2h ago",
  },
  {
    id: "2",
    name: "James Wilson",
    email: "james@example.com",
    username: "james_w",
    role: "editor",
    status: "active",
    createdAt: "Feb 3, 2025",
    lastActive: "5h ago",
  },
  {
    id: "3",
    name: "Maria Lopez",
    email: "maria@example.com",
    username: "maria_l",
    role: "user",
    status: "suspended",
    createdAt: "Mar 15, 2025",
    lastActive: "14d ago",
  },
  {
    id: "4",
    name: "Ahmed Al-Rashid",
    email: "ahmed@example.com",
    username: "ahmed_r",
    role: "moderator",
    status: "active",
    createdAt: "Apr 2, 2025",
    lastActive: "1d ago",
  },
  {
    id: "5",
    name: "Priya Sharma",
    email: "priya@example.com",
    username: "priya_s",
    role: "user",
    status: "pending",
    createdAt: "May 20, 2025",
    lastActive: "Never",
  },
  {
    id: "6",
    name: "Dmitri Volkov",
    email: "dmitri@example.com",
    username: "dmitri_v",
    role: "user",
    status: "active",
    createdAt: "Jun 1, 2025",
    lastActive: "30m ago",
  },
];

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  superadmin: {
    bg: "oklch(0.627 0.265 303.9 / 0.12)",
    color: "oklch(0.627 0.265 303.9)",
  },
  admin: { bg: "oklch(0.75 0.08 220 / 0.12)", color: "oklch(0.52 0.08 220)" },
  editor: { bg: "oklch(0.82 0.15 55 / 0.12)", color: "oklch(0.62 0.15 55)" },
  moderator: {
    bg: "oklch(0.72 0.16 142 / 0.12)",
    color: "oklch(0.58 0.16 142)",
  },
  user: {
    bg: "color-mix(in oklab, var(--sb-ink) 6%, transparent)",
    color: "var(--sb-ink-dim)",
  },
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const Route = createFileRoute("/_admin/users/")({
  loader: async () => {
    // TODO: return await fetchUsers()
    return { users: MOCK_USERS };
  },
  component: UsersPage,
});

function UsersPage() {
  const { users } = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase());
      const matchRole = !roleFilter || u.role === roleFilter;
      const matchStatus = !statusFilter || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="cursor-pointer"
          />
        ),
      },
      {
        id: "user",
        header: "User",
        accessorFn: (row) => `${row.name} ${row.email}`,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-2.5">
              <Avatar className="size-7 shrink-0">
                <AvatarFallback
                  className="text-[10px] font-semibold"
                  style={{
                    background:
                      "color-mix(in oklab, var(--sb-ink) 8%, transparent)",
                    color: "var(--sb-ink-muted)",
                  }}
                >
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span
                  className="font-semibold"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {user.name}
                </span>
                <span style={{ color: "var(--sb-ink-dim)" }}>{user.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => {
          const role = getValue<string>();
          const roleStyle = ROLE_COLORS[role] ?? ROLE_COLORS.user;
          return (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide capitalize"
              style={{ background: roleStyle.bg, color: roleStyle.color }}
            >
              {role}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => (
          <StatusBadge
            status={getValue<"active" | "suspended" | "pending">()}
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ getValue }) => (
          <span style={{ color: "var(--sb-ink-muted)" }}>
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "lastActive",
        header: "Last Active",
        cell: ({ getValue }) => (
          <span style={{ color: "var(--sb-ink-dim)" }}>
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex size-7 items-center justify-center rounded-[7px] outline-none cursor-pointer transition-all duration-100 hover:bg-[var(--sb-bg-hover)] active:scale-95"
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
                <DropdownMenuItem className="text-xs cursor-pointer">
                  View profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs cursor-pointer">
                  Edit role
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs cursor-pointer text-red-500">
                  {user.status === "suspended" ? "Unsuspend" : "Suspend"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: true,
  });

  const selectedCount = useMemo(() => {
    return Object.keys(rowSelection).filter((key) => rowSelection[key]).length;
  }, [rowSelection]);

  return (
    <div className="p-6 w-full">
      <PageHeader
        title="Users"
        description={`${users.length} total users on the platform`}
        icon={UserRound}
        breadcrumbs={[{ label: "Admin" }, { label: "Users" }]}
        actions={[
          {
            label: "Invite User",
            to: "/invites",
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
            placeholder="Search users…"
            className={cn(
              "pl-8 pr-3 py-2 text-xs rounded-[10px] outline-none w-56 transition-all duration-150",
              "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
            )}
            style={{
              background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
              border: "1px solid var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
        </div>

        {/* Role filter chips */}
        <div className="flex items-center gap-1.5">
          {[null, "admin", "editor", "moderator", "user"].map((role) => (
            <button
              key={role ?? "all"}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-150 capitalize cursor-pointer active:scale-95",
              )}
              style={{
                background:
                  roleFilter === role
                    ? "color-mix(in oklab, var(--sb-ink) 10%, transparent)"
                    : "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                border: "1px solid var(--sb-border)",
                color:
                  roleFilter === role ? "var(--sb-ink)" : "var(--sb-ink-muted)",
              }}
            >
              {role ?? "All roles"}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          {[null, "active", "suspended", "pending"].map((status) => (
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
              {status ?? "All statuses"}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedCount > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-4 text-xs"
          style={{
            background: "color-mix(in oklab, var(--sb-ink) 7%, transparent)",
            border: "1px solid var(--sb-border)",
            color: "var(--sb-ink)",
          }}
        >
          <span className="font-semibold">{selectedCount} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="xs"
              variant="outline"
              onClick={() => setRowSelection({})}
            >
              Clear
            </Button>
            <Button size="xs" variant="destructive">
              Suspend selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No users found"
          description="Try adjusting your search or filter criteria."
          action={{
            label: "Clear filters",
            onClick: () => {
              setSearch("");
              setRoleFilter(null);
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
                  {headerGroup.headers.map((header) => {
                    const isSelect = header.id === "select";
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          isSelect
                            ? "pl-4 py-3 w-10 text-left"
                            : "px-4 py-3 text-left font-semibold",
                        )}
                        style={{
                          color: isSelect ? undefined : "var(--sb-ink-dim)",
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "stagger-item transition-colors duration-100",
                    row.getIsSelected() &&
                      "bg-[color-mix(in_oklab,var(--sb-ink)_3%,transparent)]",
                  )}
                  style={{ borderBottom: "1px solid var(--sb-border)" }}
                  onMouseOver={(e) => {
                    if (!row.getIsSelected()) {
                      e.currentTarget.style.background =
                        "color-mix(in oklab, var(--sb-ink) 2%, transparent)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!row.getIsSelected())
                      e.currentTarget.style.background = "";
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isSelect = cell.column.id === "select";
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          isSelect ? "pl-4 py-3.5 w-10" : "px-4 py-3.5",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              borderTop: "1px solid var(--sb-border)",
              background: "color-mix(in oklab, var(--sb-ink) 2%, transparent)",
            }}
          >
            <span
              className="text-[11px]"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Showing {filtered.length} of {users.length} users
            </span>
            <div className="flex items-center gap-1">
              <Button size="xs" variant="outline" disabled>
                Previous
              </Button>
              <Button size="xs" variant="outline" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
