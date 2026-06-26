import { createFileRoute } from "@tanstack/react-router";
import { Folder, FolderPlus, Hash, Plus, Tag, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "#/components/admin/page-header";
import { Button } from "#/components/ui/button";
import {
  type CategoryType,
  type LmsCategory,
  type LmsTag,
  useDeleteLmsCategory,
  useDeleteLmsTag,
  useLmsCategories,
  useLmsTags,
  useSaveLmsCategory,
  useSaveLmsTag,
} from "#/hooks/use-lms-state";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_admin/learning/categories/")({
  component: LmsCategoriesPage,
});

const DEFAULT_COLORS = [
  "#f87171", // red
  "#fb923c", // orange
  "#facc15", // yellow
  "#4ade80", // green
  "#2dd4bf", // teal
  "#38bdf8", // sky
  "#818cf8", // indigo
  "#c084fc", // purple
  "#f472b6", // pink
  "#94a3b8", // slate
];

function LmsCategoriesPage() {
  const { data: categories = [], isLoading: catsLoading } = useLmsCategories();
  const { data: tags = [], isLoading: tagsLoading } = useLmsTags();

  const saveCategory = useSaveLmsCategory();
  const deleteCategory = useDeleteLmsCategory();
  const saveTag = useSaveLmsTag();
  const deleteTag = useDeleteLmsTag();

  const [activeTab, setActiveTab] = useState<"categories" | "tags">(
    "categories",
  );

  // Form states
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState<CategoryType>("course");

  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(DEFAULT_COLORS[6]);
  const [newTagType, setNewTagType] = useState<CategoryType>("course");

  // Split categories and tags by type
  const courseCats = useMemo(
    () => categories.filter((c) => c.type === "course"),
    [categories],
  );
  const tutorialCats = useMemo(
    () => categories.filter((c) => c.type === "tutorial"),
    [categories],
  );

  const courseTags = useMemo(
    () => tags.filter((t) => t.type === "course"),
    [tags],
  );
  const tutorialTags = useMemo(
    () => tags.filter((t) => t.type === "tutorial"),
    [tags],
  );

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const newCat: LmsCategory = {
      id: `cat_${Date.now()}`,
      name: newCatName,
      slug,
      parentId: null,
      type: newCatType,
      itemCount: 0,
    };

    saveCategory.mutate(newCat, {
      onSuccess: () => {
        setNewCatName("");
      },
    });
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const slug = newTagName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const newTag: LmsTag = {
      id: `tag_${Date.now()}`,
      name: newTagName,
      slug,
      color: newTagColor,
      type: newTagType,
      usageCount: 0,
    };

    saveTag.mutate(newTag, {
      onSuccess: () => {
        setNewTagName("");
      },
    });
  };

  const handleDeleteTag = (id: string) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      deleteTag.mutate(id);
    }
  };

  const isLoading = catsLoading || tagsLoading;

  return (
    <div className="p-6 w-full pb-16 space-y-8">
      <PageHeader
        title="Taxonomy & Metadata"
        description="Organize courses and tutorials using custom categories, subcategories, and color-coded tags."
        icon={Tag}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Learning" },
          { label: "Categories & Tags" },
        ]}
      />

      {/* Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: "var(--sb-border)" }}
      >
        <button
          onClick={() => setActiveTab("categories")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 -mb-[2px] transition-colors cursor-pointer",
            activeTab === "categories"
              ? "border-indigo-500 text-indigo-500 font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 -mb-[2px] transition-colors cursor-pointer",
            activeTab === "tags"
              ? "border-indigo-500 text-indigo-500 font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Tags
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      ) : activeTab === "categories" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* COURSE CATEGORIES */}
          <div
            className="island-shell rounded-xl p-5 border space-y-4"
            style={{
              borderColor: "var(--sb-border)",
              background: "transparent",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Folder size={12} className="text-indigo-500" />
                Course Categories
              </span>
              <span className="text-[10px] text-muted-foreground">
                {courseCats.length} Categories
              </span>
            </div>

            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  setNewCatType("course");
                }}
                placeholder="New course category name…"
                className="flex-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-ring"
                style={{
                  background: "transparent",
                  borderColor: "var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              />
              <Button
                type="submit"
                size="sm"
                className="text-xs gap-1 active:scale-[0.98]"
              >
                <Plus size={12} />
                Add
              </Button>
            </form>

            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {courseCats.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border text-xs hover:bg-muted/30 transition-colors"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  <div>
                    <span className="font-semibold">{cat.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-2 font-mono">
                      /{cat.slug}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-medium text-muted-foreground">
                      {cat.itemCount ?? 0} courses
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TUTORIAL CATEGORIES */}
          <div
            className="island-shell rounded-xl p-5 border space-y-4"
            style={{
              borderColor: "var(--sb-border)",
              background: "transparent",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Folder size={12} className="text-indigo-500" />
                Tutorial Categories
              </span>
              <span className="text-[10px] text-muted-foreground">
                {tutorialCats.length} Categories
              </span>
            </div>

            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  setNewCatType("tutorial");
                }}
                placeholder="New tutorial category name…"
                className="flex-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-ring"
                style={{
                  background: "transparent",
                  borderColor: "var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              />
              <Button
                type="submit"
                size="sm"
                className="text-xs gap-1 active:scale-[0.98]"
              >
                <Plus size={12} />
                Add
              </Button>
            </form>

            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {tutorialCats.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border text-xs hover:bg-muted/30 transition-colors"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  <div>
                    <span className="font-semibold">{cat.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-2 font-mono">
                      /{cat.slug}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-medium text-muted-foreground">
                      {cat.itemCount ?? 0} tutorials
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // TAGS MANAGEMENT
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Tag Card */}
          <div
            className="island-shell rounded-xl p-5 border space-y-4 h-fit"
            style={{
              borderColor: "var(--sb-border)",
              background: "transparent",
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <FolderPlus size={12} className="text-indigo-500" />
              Create Tag
            </span>

            <form onSubmit={handleAddTag} className="space-y-3">
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Tag Name</span>
                <input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="e.g. algorithms"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-ring font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Scope Type</span>
                  <select
                    value={newTagType}
                    onChange={(e) =>
                      setNewTagType(e.target.value as CategoryType)
                    }
                    className="mt-1 block w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none focus:border-ring font-normal"
                    style={{
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  >
                    <option value="course">Course</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </label>

                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Hex Color</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="size-7 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="flex-1 min-w-0 border rounded-lg px-2 py-1.5 text-[10px] text-center focus:outline-none focus:border-ring font-mono"
                      style={{
                        background: "transparent",
                        borderColor: "var(--sb-border)",
                        color: "var(--sb-ink)",
                      }}
                    />
                  </div>
                </label>
              </div>

              {/* Predefined Colors Palette */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">
                  Palette
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewTagColor(c)}
                      className={cn(
                        "size-5 rounded-full border transition-transform hover:scale-110",
                        newTagColor === c
                          ? "border-indigo-500 scale-105"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={!newTagName.trim()}
                className="w-full text-xs gap-1.5 active:scale-[0.98] mt-2"
              >
                <Plus size={14} />
                Create Tag
              </Button>
            </form>
          </div>

          {/* Tags Lists */}
          <div className="md:col-span-2 space-y-6">
            {/* COURSE TAGS */}
            <div
              className="island-shell rounded-xl p-5 border space-y-3"
              style={{
                borderColor: "var(--sb-border)",
                background: "transparent",
              }}
            >
              <div
                className="flex justify-between items-center pb-2 border-b"
                style={{ borderColor: "var(--sb-border)" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Hash size={12} className="text-indigo-500" />
                  Course Tags scope
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {courseTags.length} tags
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {courseTags.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-2">
                    No course tags configured.
                  </div>
                ) : (
                  courseTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] font-medium border"
                      style={{
                        borderColor: `${tag.color}40`,
                        backgroundColor: `${tag.color}0c`,
                        color: tag.color,
                      }}
                    >
                      <span>#{tag.name}</span>
                      <span className="text-[9px] opacity-75">
                        ({tag.usageCount ?? 0})
                      </span>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* TUTORIAL TAGS */}
            <div
              className="island-shell rounded-xl p-5 border space-y-3"
              style={{
                borderColor: "var(--sb-border)",
                background: "transparent",
              }}
            >
              <div
                className="flex justify-between items-center pb-2 border-b"
                style={{ borderColor: "var(--sb-border)" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Hash size={12} className="text-indigo-500" />
                  Tutorial Tags scope
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {tutorialTags.length} tags
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {tutorialTags.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-2">
                    No tutorial tags configured.
                  </div>
                ) : (
                  tutorialTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] font-medium border"
                      style={{
                        borderColor: `${tag.color}40`,
                        backgroundColor: `${tag.color}0c`,
                        color: tag.color,
                      }}
                    >
                      <span>#{tag.name}</span>
                      <span className="text-[9px] opacity-75">
                        ({tag.usageCount ?? 0})
                      </span>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
