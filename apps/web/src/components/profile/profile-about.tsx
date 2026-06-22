import { Edit2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";

interface ProfileAboutProps {
  data: {
    summary: string;
    goals: string;
    interests: string[];
  };
  onUpdate: (fields: Partial<ProfileAboutProps["data"]>) => void;
}

export function ProfileAbout({ data, onUpdate }: ProfileAboutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState(data.summary);
  const [editGoals, setEditGoals] = useState(data.goals);
  const [newInterest, setNewInterest] = useState("");
  const [editInterests, setEditInterests] = useState(data.interests);

  function handleSave() {
    onUpdate({
      summary: editSummary,
      goals: editGoals,
      interests: editInterests,
    });
    setIsEditing(false);
  }

  function handleAddInterest(e: React.FormEvent) {
    e.preventDefault();
    const tag = newInterest.trim();
    if (!tag) return;
    if (!editInterests.includes(tag)) {
      setEditInterests([...editInterests, tag]);
    }
    setNewInterest("");
  }

  function handleRemoveInterest(tag: string) {
    setEditInterests(editInterests.filter((t) => t !== tag));
  }

  return (
    <div
      className="p-6 rounded-2xl border flex flex-col gap-5"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-bold tracking-tight flex items-center gap-2"
          style={{
            color: "var(--page-ink)",
            fontFamily: "'Fraunces', Georgia, serif",
          }}
        >
          <Sparkles size={16} className="text-[var(--sb-accent)]" />
          About & Career Goals
        </h2>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1 rounded-md hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] transition-colors"
            title="Edit About Section"
          >
            <Edit2 size={14} />
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="flex flex-col gap-4 text-[13px] leading-relaxed">
          {/* Summary */}
          <div>
            <p
              className="font-semibold text-xs uppercase tracking-wider mb-1"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Professional Summary
            </p>
            <p style={{ color: "var(--sb-ink)" }}>{data.summary}</p>
          </div>

          {/* Goals */}
          <div>
            <p
              className="font-semibold text-xs uppercase tracking-wider mb-1"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Career Goals
            </p>
            <p style={{ color: "var(--sb-ink)" }}>{data.goals}</p>
          </div>

          {/* Interests */}
          <div>
            <p
              className="font-semibold text-xs uppercase tracking-wider mb-1.5"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Fields of Interest
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full border bg-[var(--sb-bg-hover)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
              Professional Summary
            </label>
            <textarea
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
              rows={3}
              className="w-full text-sm px-2.5 py-2 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)] resize-none"
              style={{
                borderColor: "var(--card-border)",
                color: "var(--page-ink)",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
              Career Goals
            </label>
            <textarea
              value={editGoals}
              onChange={(e) => setEditGoals(e.target.value)}
              rows={2}
              className="w-full text-sm px-2.5 py-2 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)] resize-none"
              style={{
                borderColor: "var(--card-border)",
                color: "var(--page-ink)",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
              Interests
            </label>
            <form onSubmit={handleAddInterest} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add interest tag (e.g. LLMs, DSA, React)"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                style={{
                  borderColor: "var(--card-border)",
                  color: "var(--page-ink)",
                }}
              />
              <Button type="submit" size="xs" variant="outline">
                Add Tag
              </Button>
            </form>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {editInterests.map((interest) => (
                <span
                  key={interest}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full border bg-[var(--sb-bg-hover)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-destructive hover:scale-105 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              size="xs"
              onClick={handleSave}
              style={{
                background: "var(--sb-accent)",
                color: "var(--sb-accent-foreground)",
              }}
            >
              Save Section
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditSummary(data.summary);
                setEditGoals(data.goals);
                setEditInterests(data.interests);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
