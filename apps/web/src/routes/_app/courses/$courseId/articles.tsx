import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, X, Sparkles } from "lucide-react";
import { useCourse } from "#/hooks/use-courses";

export const Route = createFileRoute("/_app/courses/$courseId/articles")({
  component: CourseArticlesPage,
});

interface CourseArticle {
  id: string;
  title: string;
  description: string;
  readTime: string;
  publishedAt: string;
  author: string;
  likes: number;
  content: string;
}

// Mock database for topic-related articles written by Shivansh Kumar
const courseArticlesDb: Record<string, CourseArticle[]> = {
  "dsa-fundamentals": [
    {
      id: "amortized-analysis",
      title: "Amortized Cost Analysis in Dynamic Vectors",
      description: "Understand the mathematical proof of amortized O(1) performance during capacity expansion in dynamic arrays like vector or ArrayList.",
      readTime: "8 min read",
      publishedAt: "June 20, 2026",
      author: "Shivansh Kumar",
      likes: 198,
      content: `## Amortized Cost Analysis in Dynamic Vectors

When we allocate memory for a static array, its capacity is fixed. To allow dynamic expansion, collections like vectors (in C++) and ArrayLists (in Java) allocate a larger block of memory under the hood once the array is full, copy elements over, and delete the old memory block.

### Why is the expansion factor 2?
V8 and C++ standard libraries typically use a growth factor of 2 (or 1.5). Let's prove why dynamic insertion is O(1) in the amortized sense.

### Mathematical Proof
Suppose we start with capacity 1 and double it whenever full:
1. Insertion 1: cost 1
2. Insertion 2: cost 1 (insertion) + 1 (copy) = 2
3. Insertion 3: cost 1 (insertion) + 2 (copy) = 3
4. Insertion 4: cost 1 (insertion) = 1
5. Insertion 5: cost 1 (insertion) + 4 (copy) = 5

For N elements, the number of copies is:
1 + 2 + 4 + 8 + ... + N/2 = N - 1 copies.

Total cost for N insertions = N (insertions) + N - 1 (copies) ≈ 2N.
Amortized cost per insertion = 2N / N = O(1) constant time!
`
    },
    {
      id: "hash-collision-strategies",
      title: "Advanced Collision Resolution in Hash Tables",
      description: "Inspect linear probing, quadratic probing, and robin hood hashing. Analyze memory caches and cache-line lookups.",
      readTime: "11 min read",
      publishedAt: "June 12, 2026",
      author: "Shivansh Kumar",
      likes: 242,
      content: `## Advanced Collision Resolution in Hash Tables

Hash tables map keys to indexes via a hash function. When two distinct keys map to the same index, a collision occurs.

### 1. Separate Chaining (Linked Lists)
Every bucket contains a linked list of entries. Easy to implement, but poor CPU cache utilization because nodes are scattered in memory.

### 2. Open Addressing
Store all entries directly in the table array.
- **Linear Probing**: If bucket is occupied, check the next bucket sequentially. Excellent CPU cache locality, but suffers from primary clustering.
- **Robin Hood Hashing**: A variation of linear probing where rich keys (keys close to their home bucket) yield their spot to poor keys (keys far from home). Reduces variance in probe lengths.
`
    }
  ],
  "system-design": [
    {
      id: "distributed-caching-scalability",
      title: "Distributed Caching: Consistent Hashing & Eviction Policies",
      description: "How to scale your distributed caching clusters using consistent hashing rings. Mitigate cache stampedes and hotspotting.",
      readTime: "14 min read",
      publishedAt: "June 18, 2026",
      author: "Shivansh Kumar",
      likes: 412,
      content: `## Distributed Caching: Consistent Hashing Rings

In a standard modulo caching cluster (\`hash(key) % N\`), adding or removing a node invalidates almost all keys. Consistent hashing solves this by mapping both nodes and keys to a 360-degree circular ring.

### Consistent Hashing Steps:
1. Hash both server IPs and keys to the ring.
2. Store key on the next clockwise server.
3. Adding a new server only requires remapping a small fraction of keys (roughly K / N).

### Preventing Hotspots with Virtual Nodes
If servers are not evenly distributed, some carry double the load. Consistent hashing mitigates this by mapping multiple virtual nodes per physical server to achieve uniform load distributions.
`
    }
  ]
};

const defaultArticles: CourseArticle[] = [
  {
    id: "v8-compiler-optimizations",
    title: "V8 Compiler Optimization Loops",
    description: "Deep dive into JIT compilation, inlining, and inline cache mechanisms in Javascript runtimes.",
    readTime: "9 min read",
    publishedAt: "June 08, 2026",
    author: "Shivansh Kumar",
    likes: 88,
    content: `## V8 Compiler Optimizations

Google's V8 JIT compiler optimizes code dynamically. When code is identified as hot, it compiles it directly into machine assembly.

### Inline Caching
Inline caching remembers the shapes of objects passed to a function. If the shape doesn't change, V8 skips the slow lookup of property locations in memory.
`
  }
];

function CourseArticlesPage() {
  const { courseId } = Route.useParams();
  const { data: course } = useCourse(courseId);
  const [selectedArticle, setSelectedArticle] = useState<CourseArticle | null>(null);

  const articles = courseArticlesDb[courseId] || defaultArticles;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back Button */}
      <Link
        to="/courses/$courseId"
        params={{ courseId }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] transition-colors"
      >
        <ArrowLeft size={14} /> Back to Course Syllabus
      </Link>

      {/* Reader Overlay */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="w-full max-w-2xl h-[80vh] rounded-2xl border flex flex-col overflow-hidden bg-[var(--sb-bg)] shadow-2xl"
            style={{ borderColor: "var(--sb-border)" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--sb-border)]">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-[var(--sb-pill)] text-[var(--sb-accent)] flex items-center gap-1">
                <Sparkles size={10} /> Topic Article
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="size-8 rounded-lg border border-[var(--sb-border)] flex items-center justify-center hover:bg-[var(--sb-bg-hover)] cursor-pointer text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-black display-title leading-tight text-[var(--sb-ink)]">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-4 text-[10px] text-[var(--sb-ink-dim)]">
                  <span>Written by <strong className="text-[var(--sb-ink)]">{selectedArticle.author}</strong></span>
                  <span>·</span>
                  <span>{selectedArticle.publishedAt}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {selectedArticle.readTime}</span>
                </div>
              </div>

              <div className="prose dark:prose-invert text-xs leading-relaxed max-w-none pt-4 text-[var(--sb-ink)]">
                <div className="whitespace-pre-wrap font-sans space-y-4">
                  {selectedArticle.content.split("\n\n").map((para, k) => {
                    if (para.startsWith("## ")) {
                      return <h3 key={k} className="text-base font-bold display-title mt-4 border-b border-[var(--sb-border)] pb-1">{para.replace("## ", "")}</h3>;
                    }
                    if (para.startsWith("### ")) {
                      return <h4 key={k} className="text-sm font-bold display-title mt-3">{para.replace("### ", "")}</h4>;
                    }
                    if (para.startsWith("1. ")) {
                      return (
                        <ol key={k} className="list-decimal pl-5 space-y-1 my-2">
                          {para.split("\n").map((li, idx) => (
                            <li key={idx}>{li.replace(/^\d+\.\s+/, "")}</li>
                          ))}
                        </ol>
                      );
                    }
                    return <p key={k}>{para}</p>;
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--sb-border)] flex items-center justify-between text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>
              <span className="flex items-center gap-1">❤️ {selectedArticle.likes} Likes</span>
              <span>Click close or press ESC to exit</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight display-title text-[var(--sb-ink)]">
          Topic Articles: {course?.title ?? "Course topics"}
        </h1>
        <p className="mt-1 text-sm text-[var(--sb-ink-muted)]">
          Read engineering logs and math-heavy concept sheets written by the instructor **Shivansh Kumar**.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="stagger-item flex flex-col gap-4 rounded-xl p-5 border cursor-pointer transition-all duration-200 hover:translate-y-[-2px] hover:border-[var(--sb-accent)]/40"
            style={{
              background: "linear-gradient(165deg, var(--surface-strong), var(--surface))",
              borderColor: "var(--line)",
              boxShadow: "0 1px 0 var(--inset-glint) inset"
            }}
          >
            <div className="space-y-1">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-[var(--sb-pill)] text-[var(--sb-ink-dim)]">
                By {article.author}
              </span>
              <h3 className="font-bold text-base leading-tight mt-1 text-[var(--sb-ink)]">
                {article.title}
              </h3>
            </div>

            <p className="text-xs line-clamp-3 leading-relaxed text-[var(--sb-ink-muted)]">
              {article.description}
            </p>

            <div className="mt-auto pt-3 border-t border-[var(--sb-border)] flex items-center justify-between text-[10px] text-[var(--sb-ink-dim)]">
              <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
              <span>❤️ {article.likes} Likes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
