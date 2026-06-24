import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StickyNote, Plus, Trash2 } from "lucide-react";

// Guard imports for server-side rendering (SSR)
let useCreateBlockNote: any = null;
let BlockNoteView: any = null;

if (typeof window !== "undefined") {
  // Dynamically load browser-only modules and styles
  const blocknoteReact = await import("@blocknote/react");
  const blocknoteMantine = await import("@blocknote/mantine");
  await import("@blocknote/core/fonts/inter.css");
  await import("@blocknote/mantine/style.css");
  
  useCreateBlockNote = blocknoteReact.useCreateBlockNote;
  BlockNoteView = blocknoteMantine.BlockNoteView;
}

export const Route = createFileRoute("/_app/learn/notes")({
  component: NotesPage,
});

interface Note {
  id: string;
  title: string;
  content: string; // JSON representation of BlockNote blocks
  updatedAt: string;
}

function NotesPage() {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    
    // Detect theme mode
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark") || 
                     document.documentElement.getAttribute("data-theme") === "dark";
      setThemeMode(isDark ? "dark" : "light");
      
      const observer = new MutationObserver(() => {
        const dark = document.documentElement.classList.contains("dark") || 
                     document.documentElement.getAttribute("data-theme") === "dark";
        setThemeMode(dark ? "dark" : "light");
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
      
      // Load saved notes
      const saved = localStorage.getItem("quild_notes");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as any[];
          // Migrate notes if they are in the old format
          const migrated = parsed.map((note: any) => {
            let content = note.content;
            let isJSON = false;
            try {
              if (content && (content.startsWith("[") || content.startsWith("{"))) {
                JSON.parse(content);
                isJSON = true;
              }
            } catch (e) {}

            if (!isJSON) {
              const blocks: any[] = [];
              if (note.blocks && Array.isArray(note.blocks)) {
                for (const b of note.blocks) {
                  if (b.type === "h1") {
                    blocks.push({
                      type: "heading",
                      props: { level: 1 },
                      content: [{ type: "text", text: b.value || "", styles: {} }]
                    });
                  } else if (b.type === "h2") {
                    blocks.push({
                      type: "heading",
                      props: { level: 2 },
                      content: [{ type: "text", text: b.value || "", styles: {} }]
                    });
                  } else if (b.type === "todo") {
                    blocks.push({
                      type: "checkListItem",
                      props: { checked: !!b.completed },
                      content: [{ type: "text", text: b.value || "", styles: {} }]
                    });
                  } else {
                    blocks.push({
                      type: "paragraph",
                      content: [{ type: "text", text: b.value || b.content || "", styles: {} }]
                    });
                  }
                }
              } else if (typeof note.content === "string") {
                const text = note.content.replace(/<[^>]*>/g, "");
                blocks.push({
                  type: "paragraph",
                  content: [{ type: "text", text: text || "Empty note...", styles: {} }]
                });
              }
              content = JSON.stringify(blocks);
            }

            return {
              id: note.id || Math.random().toString(),
              title: note.title || "Untitled Note",
              content: content || "[]",
              updatedAt: note.updatedAt || new Date().toLocaleDateString()
            };
          });

          setNotes(migrated);
          if (migrated.length > 0) {
            setActiveNoteId(migrated[0].id);
          }
        } catch (e) {
          console.error("Failed to parse notes", e);
          initializeDefaultNotes();
        }
      } else {
        initializeDefaultNotes();
      }

      return () => observer.disconnect();
    }
  }, []);

  const initializeDefaultNotes = () => {
    const defaultNotes: Note[] = [
      {
        id: "1",
        title: "Operating Systems Notes",
        content: JSON.stringify([
          {
            type: "heading",
            props: { level: 1 },
            content: [{ type: "text", text: "Kernel Bootstrapping", styles: {} }]
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "During boot, the BIOS initializes the system hardware and hands over control to the GRUB bootloader.", styles: {} }]
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "cli  # Clear interrupts\nlgdt [gdt_descriptor] # Load Global Descriptor Table", styles: { code: true } }]
          },
          {
            type: "checkListItem",
            props: { checked: true },
            content: [{ type: "text", text: "Implement GDT layout in C", styles: {} }]
          },
          {
            type: "checkListItem",
            props: { checked: false },
            content: [{ type: "text", text: "Map memory pages", styles: {} }]
          }
        ]),
        updatedAt: new Date().toLocaleDateString(),
      },
      {
        id: "2",
        title: "React Fiber Notes",
        content: JSON.stringify([
          {
            type: "heading",
            props: { level: 2 },
            content: [{ type: "text", text: "Concurrency Features in React Fiber", styles: {} }]
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "React Fiber splits rendering into render/reconciliation (which can be paused) and commit (which changes DOM, must be synchronous). useTransition helps keep the UI responsive by deprioritizing heavy computations.", styles: {} }]
          }
        ]),
        updatedAt: new Date().toLocaleDateString(),
      }
    ];
    setNotes(defaultNotes);
    if (typeof window !== "undefined") {
      localStorage.setItem("quild_notes", JSON.stringify(defaultNotes));
    }
    setActiveNoteId(defaultNotes[0].id);
  };

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("quild_notes", JSON.stringify(updated));
    }
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Math.random().toString(),
      title: "Untitled Note",
      content: JSON.stringify([
        {
          type: "paragraph",
          content: [{ type: "text", text: "Start writing here...", styles: {} }]
        }
      ]),
      updatedAt: new Date().toLocaleDateString()
    };
    const updated = [newNote, ...notes];
    saveNotes(updated);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleUpdateActiveNote = (fields: Partial<Note>) => {
    if (!activeNoteId) return;
    const updated = notes.map((n) => {
      if (n.id === activeNoteId) {
        return { ...n, ...fields, updatedAt: new Date().toLocaleDateString() };
      }
      return n;
    });
    saveNotes(updated);
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!mounted) {
    return (
      <div className="p-12 text-center text-sm text-[var(--sb-ink-dim)]">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="h-[80vh] flex border border-[var(--sb-border)] rounded-2xl overflow-hidden bg-[var(--surface-strong)]">
      {/* Left Pane: Notes List */}
      <div className="w-80 border-r border-[var(--sb-border)] flex flex-col bg-[var(--sb-bg)] shrink-0">
        <div className="p-4 border-b border-[var(--sb-border)] flex items-center justify-between gap-2">
          <h2
            className="font-bold text-sm display-title flex items-center gap-1.5"
            style={{ color: "var(--sb-ink)" }}
          >
            <StickyNote size={16} className="text-[var(--sb-accent)]" /> Notes
          </h2>
          <button
            onClick={handleCreateNote}
            className="flex items-center justify-center size-8 rounded-lg bg-[var(--sb-accent)] text-white hover:opacity-90 transition-opacity cursor-pointer"
            style={{ background: "var(--sb-accent)", color: "var(--sb-bg)" }}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[var(--sb-border)]">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--sb-bg-hover)] text-xs px-3 py-2 rounded-lg border border-[var(--sb-border)] focus:outline-none text-[var(--sb-ink)]"
          />
        </div>

        {/* Note List Scroll */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--sb-border)] scrollbar-none">
          {filteredNotes.length === 0 ? (
            <p className="text-center text-xs text-[var(--sb-ink-dim)] py-8">
              No notes found.
            </p>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-4 cursor-pointer text-xs transition-colors flex flex-col gap-1.5 group ${
                  activeNoteId === note.id
                    ? "bg-[var(--sb-pill)] font-semibold"
                    : "hover:bg-[var(--sb-bg-hover)]/40"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold truncate text-[var(--sb-ink)] max-w-[80%]">
                    {note.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-500 p-1 text-[var(--sb-ink-dim)] transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[var(--sb-ink-dim)]">
                  <span>{note.updatedAt}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Pane: Active Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--surface)]">
        {activeNote ? (
          <>
            {/* Toolbar Header */}
            <div className="p-4 border-b border-[var(--sb-border)] flex flex-row items-center justify-between gap-4 bg-[var(--sb-bg)]">
              {/* Title input */}
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateActiveNote({ title: e.target.value })}
                className="bg-transparent font-bold text-base focus:outline-none border-b border-transparent hover:border-[var(--sb-border)] focus:border-[var(--sb-accent)] pb-0.5 text-[var(--sb-ink)] w-full max-w-md"
              />
            </div>

            {/* Note Editor Area */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto blocknote-editor-container">
              <BlockNoteEditorWrapper
                key={activeNote.id}
                initialContent={activeNote.content}
                onChange={(json) => handleUpdateActiveNote({ content: json })}
                themeMode={themeMode}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-xs text-[var(--sb-ink-dim)] gap-3">
            <StickyNote size={32} />
            <p>Select a note or create a new one to begin editing.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BlockNote Editor Wrapper Component ───────────────────────────────────────

interface BlockNoteEditorProps {
  initialContent: string;
  onChange: (json: string) => void;
  themeMode: "light" | "dark";
}

function BlockNoteEditorWrapper({ initialContent, onChange, themeMode }: BlockNoteEditorProps) {
  const isLoaded = useCreateBlockNote && BlockNoteView;

  if (!isLoaded) {
    return <div className="text-xs text-[var(--sb-ink-dim)]">Loading editor...</div>;
  }

  let parsed: any = undefined;
  try {
    if (initialContent) {
      parsed = JSON.parse(initialContent);
    }
  } catch (e) {
    console.error("Failed to parse initial blocknote content", e);
  }

  const editor = useCreateBlockNote({
    initialContent: parsed,
  });

  return (
    <BlockNoteView
      editor={editor}
      onChange={() => {
        onChange(JSON.stringify(editor.document));
      }}
      theme={themeMode}
      className="h-full min-h-[400px]"
    />
  );
}
