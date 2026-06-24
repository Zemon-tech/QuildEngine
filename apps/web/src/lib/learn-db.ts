// Types for the Learn Portal
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "article" | "quiz" | "problem";
  videoUrl?: string;
  content?: string; // For articles/text-based lessons
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // Tailwind/OKLCH color representation or icon name
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  totalHours: string;
  author: string;
  enrolled: boolean;
  progress: number;
  modules: Module[];
}

export interface Article {
  id: string;
  title: string;
  description: string;
  category: "Backend" | "Frontend" | "Systems" | "Architecture" | "Security";
  readTime: string;
  publishedAt: string;
  author: string;
  likes: number;
  content: string; // Markdown text
}

export interface TutorialStep {
  title: string;
  description: string;
  codeSnippet?: string;
  language?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: "Systems" | "Backend" | "Frontend" | "DevOps";
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  author: string;
  steps: TutorialStep[];
}

export interface RoadmapNode {
  id: string;
  label: string;
  description: string;
  status: "completed" | "in-progress" | "locked";
  resources?: { label: string; to: string }[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  nodes: RoadmapNode[];
}

// ─── Mock Database Data ────────────────────────────────────────────────────────

export const mockCourses: Course[] = [
  {
    id: "dsa-fundamentals",
    title: "DSA Fundamentals",
    description: "Master essential data structures and algorithms from absolute first principles. Highly visual and practice-driven.",
    thumbnail: "from-blue-500/20 to-indigo-600/20 border-indigo-500/30",
    difficulty: "Beginner",
    rating: 4.9,
    totalHours: "32h 15m",
    author: "ShivanshKumar",
    enrolled: true,
    progress: 64,
    modules: [
      {
        id: "arrays-strings",
        title: "Arrays & Dynamic Strings",
        lessons: [
          {
            id: "array-representation",
            title: "Memory Representation of Arrays",
            duration: "12:15",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Learn how arrays are represented in RAM with contiguous memory blocks, base address calculations, and offset arithmetic."
          },
          {
            id: "dynamic-arrays",
            title: "Dynamic Arrays & Capacity Growth",
            duration: "18:40",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Explore the internals of dynamic arrays (vector in C++, ArrayList in Java) and understand amortized constant time execution."
          },
          {
            id: "two-pointers",
            title: "Two-Pointer Technique",
            duration: "22:10",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Master the two-pointer technique for array manipulation and linear scanning."
          },
          {
            id: "sliding-window",
            title: "Sliding Window Fundamentals",
            duration: "25:30",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Understand fixed and variable size sliding windows for solving sub-array problems optimally."
          }
        ]
      },
      {
        id: "linked-lists",
        title: "Linked Lists & Pointers",
        lessons: [
          {
            id: "single-linked-list",
            title: "Singily Linked Lists Internals",
            duration: "15:45",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Nodes, pointers, structural layout in memory, and fundamental operations like traversal and insertion."
          },
          {
            id: "detect-loop",
            title: "Floyd's Cycle Detection Algorithm",
            duration: "20:15",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Visual proof of Floyd's tortoise and hare algorithm for detecting cycles in linked lists."
          }
        ]
      },
      {
        id: "trees-graphs",
        title: "Trees, Graphs & Traversals",
        lessons: [
          {
            id: "binary-trees",
            title: "Binary Search Trees (BST) & Balanced Trees",
            duration: "24:50",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Understand the BST invariant, searching, insertion, and deletion algorithms."
          },
          {
            id: "graph-traversals",
            title: "Breadth-First Search & Depth-First Search",
            duration: "30:00",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Deep dive into BFS and DFS implementations using queues, stacks, and recursion on adjacency lists."
          }
        ]
      }
    ]
  },
  {
    id: "system-design",
    title: "System Design & Scaling",
    description: "Learn how to architect high-throughput, fault-tolerant distributed systems. Covers CDN, load balancers, caching, and sharding.",
    thumbnail: "from-amber-500/20 to-orange-600/20 border-orange-500/30",
    difficulty: "Advanced",
    rating: 4.8,
    totalHours: "45h 30m",
    author: "Sanket Singh",
    enrolled: true,
    progress: 22,
    modules: [
      {
        id: "load-balancers",
        title: "High Availability & Scaling",
        lessons: [
          {
            id: "scale-horiz-vert",
            title: "Horizontal vs Vertical Scaling",
            duration: "14:20",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Understanding architectural limitations of scaling vertically and how to design application servers to scale out horizontally."
          },
          {
            id: "load-balancer-algos",
            title: "Load Balancer Algorithms & Topologies",
            duration: "26:15",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Round-robin, least connections, consistent hashing, and Layer 4 vs Layer 7 routing systems."
          }
        ]
      },
      {
        id: "caching-layer",
        title: "Distributed Caching Strategies",
        lessons: [
          {
            id: "cache-policies",
            title: "Cache Eviction: LRU, LFU & TTL",
            duration: "18:30",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Implementing eviction strategies and designing a high-efficiency caching layer in memory."
          },
          {
            id: "cache-patterns",
            title: "Cache-Aside, Write-Through & Write-Behind",
            duration: "21:40",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Mastering cache invalidation patterns, database synchronization, and caching consistency levels."
          }
        ]
      }
    ]
  },
  {
    id: "react-advanced",
    title: "React Advanced Patterns",
    description: "Deep dive into React core internals. Learn fiber reconciliation, custom hook architecture, and state management optimization.",
    thumbnail: "from-teal-500/20 to-cyan-600/20 border-cyan-500/30",
    difficulty: "Intermediate",
    rating: 4.7,
    totalHours: "24h 00m",
    author: "Harkirat Singh",
    enrolled: true,
    progress: 89,
    modules: [
      {
        id: "react-fiber",
        title: "Under the Hood: React Fiber",
        lessons: [
          {
            id: "fiber-reconciliation",
            title: "Reconciliation Engine & Fiber Nodes",
            duration: "28:10",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Learn how the virtual DOM reconciles updates with fiber node trees, concurrent scheduling, and rendering phases."
          },
          {
            id: "concurrent-features",
            title: "Concurrent Rendering & Transitions",
            duration: "22:45",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Using useTransition, useDeferredValue, and suspense to optimize UI responsiveness."
          }
        ]
      }
    ]
  },
  {
    id: "operating-systems",
    title: "Operating Systems from Scratch",
    description: "Explore the internal architecture of operating systems. Build a basic kernel, understand processes, virtual memory, and file systems.",
    thumbnail: "from-purple-500/20 to-pink-600/20 border-pink-500/30",
    difficulty: "Advanced",
    rating: 4.9,
    totalHours: "38h 15m",
    author: "Alex Rivers",
    enrolled: false,
    progress: 0,
    modules: [
      {
        id: "kernel-bootstrapping",
        title: "Kernel Bootstrapping",
        lessons: [
          {
            id: "boot-sequence",
            title: "The BIOS & Bootloader Handshake",
            duration: "18:20",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Understanding real mode vs protected mode, x86 assembly booting, and GRUB integration."
          },
          {
            id: "kernel-entry",
            title: "Writing a Bare-Metal Kernel Entry in Assembly",
            duration: "25:40",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Setup the stack, disable interrupts, and transition control flow to a bare-metal C main function."
          }
        ]
      },
      {
        id: "process-mgmt",
        title: "Processes, Threads & Scheduler",
        lessons: [
          {
            id: "context-switching",
            title: "Context Switching Internals",
            duration: "22:15",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: "Saving registers, Process Control Block (PCB) structures, and thread scheduler implementations."
          }
        ]
      }
    ]
  }
];

export const mockArticles: Article[] = [
  {
    id: "v8-engine-internals",
    title: "JavaScript Engine Deep Dive: V8 Compilation & Memory Management",
    description: "An in-depth look into how Google's V8 engine compiles JS to machine code via Ignition and Fanfare, and how it manages the heap and garbage collector.",
    category: "Systems",
    readTime: "12 min read",
    publishedAt: "June 15, 2026",
    author: "Arjun Mehta",
    likes: 342,
    content: `# JavaScript Engine Deep Dive: V8 Internals

Have you ever wondered how JavaScript, a dynamically typed, interpreted scripting language, runs at near-native speeds? The secret lies in highly optimized runtimes, the most famous of which is Google's **V8 engine**, powering both Chrome and Node.js.

In this deep dive, we'll examine:
1. The V8 Pipeline: Ignition and TurboFan
2. Just-In-Time (JIT) Compilation & Optimization loops
3. Memory Heap layout & Orinoco Garbage Collection

---

## 1. The V8 Pipeline

JavaScript source code undergoes several transformations before execution:

\`\`\`mermaid
graph TD
    A[JS Source Code] --> B(Parser)
    B --> C(AST - Abstract Syntax Tree)
    C --> D(Ignition Interpreter)
    D --> E(Bytecode Execution)
    E -->|Profiling Data| F(TurboFan Compiler)
    F -->|Optimized Machine Code| G(Native Execution)
    G -->|Deoptimization| D
\`\`\`

### The Interpreter: Ignition
Ignition is V8's fast register-based interpreter. It parses JS source and generates compact bytecode. While interpreting, Ignition collects **profiling metadata** (e.g., feedback vectors tracking type shapes).

### The Compiler: TurboFan
When a bytecode function becomes "hot" (run frequently), V8 passes the bytecode along with the profiling data to **TurboFan**, a Just-In-Time (JIT) compiler. TurboFan compiles the code directly into optimized native assembly language.

---

## 2. Dynamic Typing and Hidden Classes (Shapes)

Since JS doesn't have compiler-enforced types, V8 creates internal structures called **Hidden Classes** (or Shapes/Maps) at runtime to represent object blueprints.

\`\`\`javascript
function Point(x, y) {
  this.x = x;
  this.y = y;
}
const p1 = new Point(1, 2);
const p2 = new Point(3, 4);
\`\`\`

- When \`p1\` is created, it gets a hidden class \`C0\`.
- Adding \`x\` transitions it to class \`C1\`.
- Adding \`y\` transitions it to class \`C2\`.
- Because \`p2\` follows the same sequence, it shares class \`C2\`, enabling fast **Inline Caching (IC)** for property lookups.

---

## 3. Memory Structure & Garbage Collection

V8 divides its memory heap into several spaces:
- **New Space (Nursery/Intermediate)**: Where new allocations occur. Managed by a copying scavenger.
- **Old Pointer Space**: Objects containing pointers that survived multiple GC cycles.
- **Old Data Space**: Raw data (strings, numbers) that survived GC.
- **Large Object Space**: Allocations exceeding size limits of other spaces.

The garbage collector, **Orinoco**, operates concurrently and incrementally to avoid UI/thread blocks, ensuring modern web applications achieve fluid, responsive performance.
`
  },
  {
    id: "scaling-websockets",
    title: "Scaling WebSockets to 10 Million Concurrent Connections",
    description: "Discover the system architecture patterns, Linux kernel tweaks, and protocol hacks needed to scale real-time WebSocket servers under heavy memory constraints.",
    category: "Architecture",
    readTime: "15 min read",
    publishedAt: "May 28, 2026",
    author: "Elena Rostov",
    likes: 512,
    content: `# Scaling WebSockets to 10 Million Connections

Building a chat app or a real-time collaborative tool is easy locally. But when your user base grows to millions of active sockets, you run into severe infrastructure barriers:
- **Port exhaustion**
- **Linux file descriptor limits**
- **RAM constraints (per-connection overhead)**
- **CPU scheduling bottlenecks**

This article details how to architect, configure, and scale WebSocket clusters to 10M+ concurrent open connections.

---

## 1. Operating System Tuning

Every WebSocket connection is represented by a TCP socket, which is treated as a file descriptor by Linux. 

### Increasing File Descriptor Limits
By default, Linux limits file descriptors per process to 1024. For high-scale servers, modify \`/etc/security/limits.conf\`:
\`\`\`bash
* soft nofile 10485760
* hard nofile 10485760
\`\`\`

### TCP Buffer Memory Optimization
Reduce TCP buffer size allocations per socket to conserve system RAM. In \`/etc/sysctl.conf\`:
\`\`\`ini
net.ipv4.tcp_rmem = 2048 4096 8192
net.ipv4.tcp_wmem = 2048 4096 8192
\`\`\`
This caps socket buffer sizes at 8KB, allowing you to fit millions of sockets in memory without running out of RAM.

---

## 2. Load Balancing Topology

Do not expose websocket servers directly. Use a high-efficiency load balancer like **NGINX** or **HAProxy** at the edge to terminate SSL and distribute TCP connections.

\`\`\`
Client Sockets  --->  Load Balancer (SSL Termination)  --->  WebSocket App Nodes
                            |
                     Shared Redis Pub/Sub (State Sync)
\`\`\`

Because load-balanced clients land on different app instances, you must synchronize messages using a fast pub/sub message broker (like Redis or NATS) to forward events across nodes.
`
  }
];

export const mockTutorials: Tutorial[] = [
  {
    id: "custom-http-server-c",
    title: "Build a Custom HTTP Server in C from Scratch",
    description: "Write raw socket boilerplate, parse HTTP headers, manage connection lifecycles, and handle concurrent client requests with select/poll.",
    category: "Systems",
    difficulty: "Hard",
    estimatedTime: "2 hours",
    author: "David Vance",
    steps: [
      {
        title: "Step 1: Socket Creation & Binding",
        description: "Start by creating an IPv4 TCP socket and binding it to a local port. We use standard POSIX syscalls.",
        codeSnippet: `#include <stdio.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>

int main() {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(8080);
    
    bind(server_fd, (struct sockaddr *)&address, sizeof(address));
    listen(server_fd, 10);
    printf("Server listening on port 8080\\n");
    return 0;
}`,
        language: "c"
      },
      {
        title: "Step 2: Accepting Connections & Parsing Headers",
        description: "Add an event loop to accept incoming client connections, read client bytes, and print the raw HTTP request header.",
        codeSnippet: `int addrlen = sizeof(address);
while(1) {
    int client_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen);
    char buffer[1024] = {0};
    read(client_socket, buffer, 1024);
    printf("Raw Request:\\n%s\\n", buffer);
    
    char *response = "HTTP/1.1 200 OK\\nContent-Type: text/plain\\nContent-Length: 12\\n\\nHello World!";
    write(client_socket, response, strlen(response));
    close(client_socket);
}`,
        language: "c"
      }
    ]
  },
  {
    id: "secure-jwt-auth-express",
    title: "Secure JWT Authentication with HttpOnly Cookies",
    description: "Learn how to build a production-ready authentication flow in Express.js. Mitigate XSS and CSRF using signed HttpOnly cookies.",
    category: "Backend",
    difficulty: "Medium",
    estimatedTime: "45 mins",
    author: "ShivanshKumar",
    steps: [
      {
        title: "Step 1: Express Server & Cookie Setup",
        description: "Initialize an Express app and configure cookie-parser. Configure cookie flags such as httpOnly, secure, and sameSite.",
        codeSnippet: `const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cookieParser('my-secret-key'));

app.post('/api/login', (req, res) => {
  const token = jwt.sign({ userId: '123' }, 'jwt-secret', { expiresIn: '1h' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  });
  res.json({ success: true, message: 'Logged in successfully' });
});`,
        language: "javascript"
      }
    ]
  }
];

export const mockRoadmaps: Roadmap[] = [
  {
    id: "backend-developer",
    title: "Backend Engineer Learning Path",
    description: "From programming fundamentals, database designs, networks, up to scaling distributed systems.",
    nodes: [
      {
        id: "programming-lang",
        label: "1. Core Language",
        description: "Master a structured backend programming language like Go, Rust, C++, or TypeScript.",
        status: "completed",
        resources: [
          { label: "Go Tour", to: "https://go.dev/tour/" },
          { label: "Rust Book", to: "https://doc.rust-lang.org/book/" }
        ]
      },
      {
        id: "networking-basics",
        label: "2. Networking Protocols",
        description: "Understand TCP/IP sockets, DNS resolution, HTTP/1.1, HTTP/2, TLS handshake, and gRPC endpoints.",
        status: "in-progress",
        resources: [
          { label: "Build HTTP Server in C", to: "/learn/tutorials?id=custom-http-server-c" }
        ]
      },
      {
        id: "relational-databases",
        label: "3. Databases & Indexing",
        description: "SQL schemas, relational modeling, index implementation (B-Trees vs LSM), ACID guarantees, and transactions.",
        status: "locked"
      },
      {
        id: "caching-scaling",
        label: "4. Distributed Caching",
        description: "Scale read-heavy workloads using Redis or Memcached clusters. Design invalidation protocols.",
        status: "locked"
      }
    ]
  }
];
