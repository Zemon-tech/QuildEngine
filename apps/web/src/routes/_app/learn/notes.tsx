import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  StickyNote, Plus, Trash2, Sparkles, CheckSquare, 
  Type, Heading1, Heading2, Code 
} from "lucide-react";


// Guard imports for server-side rendering (SSR)
let EditorContent: any = null;
let useEditor: any = null;
let StarterKit: any = null;

if (typeof window !== "undefined") {
  // Dynamically load browser-only modules
  const tiptapReact = await import("@tiptap/react");
  const tiptapKit = await import("@tiptap/starter-kit");
  EditorContent = tiptapReact.EditorContent;
  useEditor = tiptapReact.useEditor;
  StarterKit = tiptapKit.default;
}

export const Route = createFileRoute("/_app/learn/notes")({
  component: NotesPage,
});

interface Note {
  id: string;
  title: string;
  content: string;
  blocks: Array<{ id: string; type: "text" | "h1" | "h2" | "code" | "todo"; value: string; completed?: boolean }>;
  editorType: "tiptap" | "blocknote";
  updatedAt: string;
}

function NotesPage() {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quild_notes");
      if (saved) {
        const parsed = JSON.parse(saved) as Note[];
        setNotes(parsed);
        if (parsed.length > 0) {
          setActiveNoteId(parsed[0].id);
        }
      } else {
        const defaultNotes: Note[] = [
          {
            id: "1",
            title: "Operating Systems Notes",
            content: "<p>Remember to review the context switching assembly routine next week. Context switching saves registers on the PCB (Process Control Block) and loads the new thread state.</p>",
            blocks: [
              { id: "b1", type: "h1", value: "Kernel Bootstrapping" },
              { id: "b2", type: "text", value: "During boot, the BIOS initializes the system hardware and hands over control to the GRUB bootloader." },
              { id: "b3", type: "code", value: "cli  # Clear interrupts\nlgdt [gdt_descriptor] # Load Global Descriptor Table" },
              { id: "b4", type: "todo", value: "Implement GDT layout in C", completed: true },
              { id: "b5", type: "todo", value: "Map memory pages", completed: false }
            ],
            editorType: "blocknote",
            updatedAt: new Date().toLocaleDateString(),
          },
          {
            id: "2",
            title: "React Fiber Notes",
            content: "<p>React Fiber splits rendering into render/reconciliation (which can be paused) and commit (which changes DOM, must be synchronous).</p>",
            blocks: [
              { id: "b6", type: "h2", value: "Concurrency features" },
              { id: "b7", type: "text", value: "useTransition helps keep the UI responsive by deprioritizing heavy computations." }
            ],
            editorType: "tiptap",
            updatedAt: new Date().toLocaleDateString(),
          }
        ];
        setNotes(defaultNotes);
        localStorage.setItem("quild_notes", JSON.stringify(defaultNotes));
        setActiveNoteId(defaultNotes[0].id);
      }
    }
  }, []);

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("quild_notes", JSON.stringify(updated));
    }
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Math.random().toString(),
      title: "Untitled Note",
      content: "<p>Start writing notes here...</p>",
      blocks: [
        { id: Math.random().toString(), type: "text", value: "Start writing blocks here..." }
      ],
      editorType: "blocknote",
      updatedAt: new Date().toLocaleDateString()
    };
    const updated = [newNote, ...notes];
    saveNotes(updated);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleUpdateActiveNote = (fields: Partial<Note>) => {
    if (!activeNoteId) return;
    const updated = notes.map(n => {
      if (n.id === activeNoteId) {
        return { ...n, ...fields, updatedAt: new Date().toLocaleDateString() };
      }
      return n;
    });
    saveNotes(updated);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) {
    return <div className="p-12 text-center text-sm text-[var(--sb-ink-dim)]">Loading workspace...</div>;
  }

  return (
    <div className="h-[80vh] flex border border-[var(--sb-border)] rounded-2xl overflow-hidden bg-[var(--surface-strong)]">
      {/* Left Pane: Notes List */}
      <div className="w-80 border-r border-[var(--sb-border)] flex flex-col bg-[var(--sb-bg)] shrink-0">
        <div className="p-4 border-b border-[var(--sb-border)] flex items-center justify-between gap-2">
          <h2 className="font-bold text-sm display-title flex items-center gap-1.5" style={{ color: "var(--sb-ink)" }}>
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
            <p className="text-center text-xs text-[var(--sb-ink-dim)] py-8">No notes found.</p>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-4 cursor-pointer text-xs transition-colors flex flex-col gap-1.5 ${
                  activeNoteId === note.id 
                    ? "bg-[var(--sb-pill)] font-semibold" 
                    : "hover:bg-[var(--sb-bg-hover)]/40"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold truncate text-[var(--sb-ink)] max-w-[80%]">{note.title}</span>
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
                  <span className="uppercase text-[8px] font-black border border-[var(--sb-border)] px-1 rounded-sm">
                    {note.editorType}
                  </span>
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
            <div className="p-4 border-b border-[var(--sb-border)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--sb-bg)]">
              {/* Title input */}
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateActiveNote({ title: e.target.value })}
                className="bg-transparent font-bold text-base focus:outline-none border-b border-transparent hover:border-[var(--sb-border)] focus:border-[var(--sb-accent)] pb-0.5 text-[var(--sb-ink)]"
              />

              {/* Editor Toggle */}
              <div className="flex bg-[var(--sb-pill)] p-1 rounded-lg border border-[var(--sb-border)] self-start text-[10px]">
                <button
                  onClick={() => handleUpdateActiveNote({ editorType: "blocknote" })}
                  className={`px-3 py-1 font-bold rounded transition-all cursor-pointer ${
                    activeNote.editorType === "blocknote"
                      ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] shadow-sm"
                      : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
                  }`}
                >
                  BlockNote.js Blocks
                </button>
                <button
                  onClick={() => handleUpdateActiveNote({ editorType: "tiptap" })}
                  className={`px-3 py-1 font-bold rounded transition-all cursor-pointer ${
                    activeNote.editorType === "tiptap"
                      ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] shadow-sm"
                      : "text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
                  }`}
                >
                  TipTap WYSIWYG
                </button>
              </div>
            </div>

            {/* Note Editor Area */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              {activeNote.editorType === "tiptap" ? (
                <TipTapEditorWrapper 
                  content={activeNote.content} 
                  onChange={(html) => handleUpdateActiveNote({ content: html })}
                />
              ) : (
                <BlockNoteEditorWrapper 
                  blocks={activeNote.blocks} 
                  onChange={(blocks) => handleUpdateActiveNote({ blocks })}
                />
              )}
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

// ─── TipTap Editor Wrapper Component ──────────────────────────────────────────

interface TipTapProps {
  content: string;
  onChange: (html: string) => void;
}

function TipTapEditorWrapper({ content, onChange }: TipTapProps) {
  const isLoaded = useEditor && EditorContent && StarterKit;

  if (!isLoaded) {
    return <textarea 
      value={content} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full h-full p-4 font-mono text-xs border border-[var(--sb-border)] rounded-xl bg-transparent text-[var(--sb-ink)] focus:outline-none"
    />;
  }

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }: { editor: any }) => {
      onChange(editor.getHTML());
    },
  }, [content]);

  if (!editor) return null;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Editor toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[var(--sb-pill)] rounded-xl border border-[var(--sb-border)] text-xs">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-all cursor-pointer ${
            editor.isActive("bold") ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] border border-[var(--sb-border)]" : "text-[var(--sb-ink-dim)]"
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-all cursor-pointer ${
            editor.isActive("italic") ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] border border-[var(--sb-border)]" : "text-[var(--sb-ink-dim)]"
          }`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded transition-all cursor-pointer font-extrabold ${
            editor.isActive("heading", { level: 1 }) ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] border border-[var(--sb-border)]" : "text-[var(--sb-ink-dim)]"
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded transition-all cursor-pointer font-bold ${
            editor.isActive("heading", { level: 2 }) ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] border border-[var(--sb-border)]" : "text-[var(--sb-ink-dim)]"
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded transition-all cursor-pointer ${
            editor.isActive("codeBlock") ? "bg-[var(--sb-bg)] text-[var(--sb-accent)] border border-[var(--sb-border)]" : "text-[var(--sb-ink-dim)]"
          }`}
        >
          <Code size={14} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 bg-[var(--sb-bg)] rounded-xl border border-[var(--sb-border)] p-4 overflow-y-auto text-sm focus-within:ring-1 focus-within:ring-[var(--sb-accent)]/35 text-[var(--sb-ink)] leading-relaxed">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

// ─── BlockNote.js Blocks Editor Wrapper ────────────────────────────────────────

interface BlockNoteProps {
  blocks: Note["blocks"];
  onChange: (blocks: Note["blocks"]) => void;
}

function BlockNoteEditorWrapper({ blocks, onChange }: BlockNoteProps) {
  const [dropdownBlockId, setDropdownBlockId] = useState<string | null>(null);

  const handleUpdateBlockValue = (id: string, value: string) => {
    const updated = blocks.map(b => (b.id === id ? { ...b, value } : b));
    onChange(updated);
  };

  const handleToggleTodo = (id: string) => {
    const updated = blocks.map(b => (b.id === id ? { ...b, completed: !b.completed } : b));
    onChange(updated);
  };

  const handleAddBlock = (index: number) => {
    const newBlock = { id: Math.random().toString(), type: "text" as const, value: "" };
    const copy = [...blocks];
    copy.splice(index + 1, 0, newBlock);
    onChange(copy);
  };

  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) return;
    const updated = blocks.filter(b => b.id !== id);
    onChange(updated);
  };

  const handleChangeBlockType = (id: string, type: Note["blocks"][0]["type"]) => {
    const updated = blocks.map(b => (b.id === id ? { ...b, type, completed: type === "todo" ? false : undefined } : b));
    onChange(updated);
    setDropdownBlockId(null);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Help Banner */}
      <div className="p-3 rounded-xl border border-teal-500/20 bg-teal-500/5 text-[10px] text-teal-600 dark:text-teal-400 flex items-center justify-between">
        <span className="flex items-center gap-1"><Sparkles size={12} /> Notion-Style BlockNote: Hover on any block block to change types or delete.</span>
      </div>

      {/* Block List Content */}
      <div className="flex-1 bg-[var(--sb-bg)] rounded-xl border border-[var(--sb-border)] p-4 overflow-y-auto space-y-4 text-xs scrollbar-none">
        {blocks.map((block, idx) => (
          <div key={block.id} className="group relative flex items-start gap-3 pl-8">
            
            {/* Block Action Controls (Hover Left) */}
            <div className="absolute left-0 top-1 opacity-0 group-hover:opacity-100 flex items-center gap-1">
              {/* Type Switcher */}
              <div className="relative">
                <button
                  onClick={() => setDropdownBlockId(dropdownBlockId === block.id ? null : block.id)}
                  className="p-1 rounded hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink-dim)] cursor-pointer"
                  title="Change Block Type"
                >
                  <Type size={11} />
                </button>
                {dropdownBlockId === block.id && (
                  <div className="absolute left-0 top-6 z-20 w-32 border border-[var(--sb-border)] bg-[var(--sb-bg)] rounded-lg shadow-lg p-1 space-y-0.5 text-[9px] font-bold">
                    <button onClick={() => handleChangeBlockType(block.id, "text")} className="w-full text-left p-1.5 rounded hover:bg-[var(--sb-bg-hover)] flex items-center gap-1.5"><Type size={10} /> Text</button>
                    <button onClick={() => handleChangeBlockType(block.id, "h1")} className="w-full text-left p-1.5 rounded hover:bg-[var(--sb-bg-hover)] flex items-center gap-1.5"><Heading1 size={10} /> Header 1</button>
                    <button onClick={() => handleChangeBlockType(block.id, "h2")} className="w-full text-left p-1.5 rounded hover:bg-[var(--sb-bg-hover)] flex items-center gap-1.5"><Heading2 size={10} /> Header 2</button>
                    <button onClick={() => handleChangeBlockType(block.id, "code")} className="w-full text-left p-1.5 rounded hover:bg-[var(--sb-bg-hover)] flex items-center gap-1.5"><Code size={10} /> Code Block</button>
                    <button onClick={() => handleChangeBlockType(block.id, "todo")} className="w-full text-left p-1.5 rounded hover:bg-[var(--sb-bg-hover)] flex items-center gap-1.5"><CheckSquare size={10} /> Checklist</button>
                  </div>
                )}
              </div>

              {/* Add Block */}
              <button
                onClick={() => handleAddBlock(idx)}
                className="p-1 rounded hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink-dim)] cursor-pointer"
                title="Add block below"
              >
                <Plus size={11} />
              </button>

              {/* Delete Block */}
              <button
                onClick={() => handleDeleteBlock(block.id)}
                className="p-1 rounded hover:bg-[var(--sb-bg-hover)] hover:text-red-500 text-[var(--sb-ink-dim)] cursor-pointer"
                title="Delete block"
              >
                <Trash2 size={11} />
              </button>
            </div>

            {/* Block Input Content */}
            <div className="flex-1">
              {block.type === "text" && (
                <textarea
                  value={block.value}
                  onChange={(e) => handleUpdateBlockValue(block.id, e.target.value)}
                  placeholder="Type '/' for commands..."
                  className="w-full bg-transparent focus:outline-none resize-none text-sm text-[var(--sb-ink)] leading-relaxed"
                  rows={Math.max(1, block.value.split("\n").length)}
                />
              )}

              {block.type === "h1" && (
                <input
                  type="text"
                  value={block.value}
                  onChange={(e) => handleUpdateBlockValue(block.id, e.target.value)}
                  placeholder="Header 1"
                  className="w-full bg-transparent focus:outline-none font-extrabold text-xl text-[var(--sb-ink)] display-title"
                />
              )}

              {block.type === "h2" && (
                <input
                  type="text"
                  value={block.value}
                  onChange={(e) => handleUpdateBlockValue(block.id, e.target.value)}
                  placeholder="Header 2"
                  className="w-full bg-transparent focus:outline-none font-bold text-lg text-[var(--sb-ink)] display-title"
                />
              )}

              {block.type === "code" && (
                <textarea
                  value={block.value}
                  onChange={(e) => handleUpdateBlockValue(block.id, e.target.value)}
                  placeholder="// Write your code snippet here"
                  className="w-full p-3 font-mono text-xs rounded-xl bg-zinc-950 dark:bg-black text-emerald-400 focus:outline-none resize-none"
                  rows={Math.max(3, block.value.split("\n").length)}
                />
              )}

              {block.type === "todo" && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={block.completed ?? false}
                    onChange={() => handleToggleTodo(block.id)}
                    className="size-4 rounded border-[var(--sb-border)] focus:ring-[var(--sb-accent)]/40 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={block.value}
                    onChange={(e) => handleUpdateBlockValue(block.id, e.target.value)}
                    placeholder="To-do item"
                    className={`w-full bg-transparent focus:outline-none text-sm text-[var(--sb-ink)] ${
                      block.completed ? "line-through text-[var(--sb-ink-dim)] opacity-60" : ""
                    }`}
                  />
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
