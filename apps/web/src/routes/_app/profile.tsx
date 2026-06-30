import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Download,
  FileText,
  FolderGit2,
  Hammer,
  Printer,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ProfileAbout } from "#/components/profile/profile-about";
import type {
  AchievementItem,
  ActivityEvent,
} from "#/components/profile/profile-analytics";
import { ProfileAnalytics } from "#/components/profile/profile-analytics";
import type {
  EducationItem,
  ExperienceItem,
} from "#/components/profile/profile-experience";
import { ProfileExperience } from "#/components/profile/profile-experience";
import { ProfileHeader } from "#/components/profile/profile-header";
import type {
  ProjectItem,
  ResearchItem,
} from "#/components/profile/profile-projects";
import { ProfileProjects } from "#/components/profile/profile-projects";
import { ProfileSettings } from "#/components/profile/profile-settings";
import type { CertItem } from "#/components/profile/profile-skills";
import { ProfileSkills } from "#/components/profile/profile-skills";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "#/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

export const Route = createFileRoute("/_app/profile")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || "profile",
    };
  },
  component: ProfilePage,
});

interface ProfileData {
  header: {
    name: string;
    headline: string;
    location: string;
    website: string;
    github: string;
    linkedin: string;
    leetcode: string;
    email: string;
    resumeName: string | null;
  };
  about: {
    summary: string;
    goals: string;
    interests: string[];
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  research: ResearchItem[];
  skills: {
    technical: string[];
    soft: string[];
    tooling: string[];
  };
  certifications: CertItem[];
  achievements: AchievementItem[];
  stats: {
    coursesCompleted: number;
    dsaSolved: number;
    hoursLearned: number;
    streakDays: number;
  };
  activities: ActivityEvent[];
  settings: {
    profilePublic: boolean;
    showActivity: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
}

const DEFAULT_PROFILE_DATA: ProfileData = {
  header: {
    name: "Alex Johnson",
    headline: "AI Engineer Intern @ Quild | CS Major @ Stanford",
    location: "Stanford, CA",
    website: "https://alexjohnson.dev",
    github: "https://github.com/alexjohnson",
    linkedin: "https://linkedin.com/in/alexjohnson",
    leetcode: "https://leetcode.com/alexjohnson",
    email: "alex@example.com",
    resumeName: "Alex_Johnson_Resume.pdf",
  },
  about: {
    summary:
      "Passionate computer science student specializing in building AI-first platforms and developer tooling. Experienced with React, TypeScript, Python, and Large Language Model integrations. Eager to solve complex algorithmic problems and design modular systems.",
    goals:
      "Seeking full-time roles in Machine Learning Systems and Full-Stack AI Product development. Aims to build interfaces that seamlessly bridge AI capabilities with developer workflows.",
    interests: [
      "LLMs & RAG",
      "Data Structures",
      "System Design",
      "UI/UX Aesthetics",
    ],
  },
  experience: [
    {
      company: "Quild Software",
      role: "AI Engineer Intern",
      type: "Internship",
      duration: "Jun 2025 - Present",
      description:
        "Designed and built an interactive AI learning assistant side-panel. Integrated custom OKLCH color token themes and built expandable DSA practice navigations using Framer Motion.",
      tech: ["React", "TypeScript", "TanStack Router", "Framer Motion"],
    },
    {
      company: "Stanford AI Lab",
      role: "Undergraduate Researcher",
      type: "Part-time",
      duration: "Sep 2024 - Jun 2025",
      description:
        "Researched retrieval augmented generation (RAG) models. Optimized chunking size limits and search weights, reducing output hallucinations by 18%.",
      tech: ["Python", "PyTorch", "OpenAI API", "VectorDB"],
    },
  ],
  education: [
    {
      school: "Stanford University",
      degree: "B.S. in Computer Science",
      duration: "2021 - 2025",
      gpa: "3.91 / 4.00",
      courses:
        "Analysis of Algorithms, Machine Learning, Operating Systems, Distributed Systems",
    },
  ],
  projects: [
    {
      name: "QuildEngine Workspace",
      description:
        "An AI-first developer learning platform featuring practice modules, progress contribution grids, and theme management.",
      tech: ["React", "TypeScript", "next-themes", "Tailwind CSS v4"],
      github: "https://github.com/alexjohnson/quild-engine",
      demo: "http://localhost:3000",
    },
    {
      name: "RAG Evaluation Tool",
      description:
        "A Python dashboard to evaluate hallucinations in LLM retrieval pipelines using cosine-similarity thresholds.",
      tech: ["Python", "Streamlit", "LangChain"],
      github: "https://github.com/alexjohnson/rag-eval",
    },
  ],
  research: [
    {
      title: "Context Optimization in Code Generation Models",
      summary:
        "Evaluated token window limits and retrieval weights for inline code generation assistants. Published findings in Stanford CS Undergrad Journal.",
      link: "https://arxiv.org/abs/placeholder",
      date: "May 2025",
    },
  ],
  skills: {
    technical: ["React", "TypeScript", "Python", "C++", "SQL", "Tailwind CSS"],
    soft: [
      "Technical Writing",
      "Public Speaking",
      "Problem Solving",
      "Collaboration",
    ],
    tooling: ["Git", "Docker", "VS Code", "Vite", "Turborepo"],
  },
  certifications: [
    {
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "Dec 2024",
      credentialUrl: "https://aws.amazon.com/verification",
    },
    {
      name: "Advanced React & Router Systems",
      issuer: "Frontend Masters",
      date: "Aug 2024",
    },
  ],
  achievements: [
    {
      title: "1st Place - Stanford Hacks",
      event: "Stanford Hackathon",
      rank: "Winner (out of 120 teams)",
      date: "Jan 2025",
    },
    {
      title: "Top 2% Ranking - LeetCode Weekly",
      event: "LeetCode Coding Contests",
      rank: "Global Rating: 2150",
      date: "Continuous",
    },
  ],
  stats: {
    coursesCompleted: 4,
    dsaSolved: 147,
    hoursLearned: 58,
    streakDays: 7,
  },
  activities: [
    {
      id: "a1",
      type: "certification",
      content: "Earned AWS Certified Cloud Practitioner credential",
      date: "Dec 2024",
    },
    {
      id: "a2",
      type: "course",
      content: "Completed Binary Search Trees learning module",
      date: "Just now",
    },
    {
      id: "a3",
      type: "dsa",
      content: "Solved 12 Graph algorithms practice challenges",
      date: "Yesterday",
    },
  ],
  settings: {
    profilePublic: true,
    showActivity: true,
    emailNotifications: true,
    pushNotifications: false,
  },
};

type TabType = "profile" | "analytics" | "projects" | "skills" | "settings";

function ProfilePage() {
  const search = Route.useSearch();
  const activeTab = (search.tab as TabType) || "profile";
  const navigate = Route.useNavigate();

  function setActiveTab(tab: TabType) {
    navigate({
      search: (prev) => ({ ...prev, tab }),
    });
  }

  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [showResumePreview, setShowResumePreview] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("quild_profile_data_v1");
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Error reading profile data from localStorage", e);
      }
    }
  }, []);

  // Save to localStorage when profile changes
  function updateProfile(newData: ProfileData) {
    setProfile(newData);
    localStorage.setItem("quild_profile_data_v1", JSON.stringify(newData));
  }

  const tabs: { id: TabType; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "projects", label: "Projects & Research", icon: FolderGit2 },
    { id: "skills", label: "Skills & Certs", icon: Hammer },
    { id: "analytics", label: "Analytics & Feed", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-4xl pb-16">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabType)}
        className="w-full"
      >
        {/* Tabs Header */}
        <TabsList className="flex border-b mb-6 overflow-x-auto whitespace-nowrap scrollbar-none bg-transparent border-card-border p-0 gap-1 rounded-none justify-start w-full">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors outline-none cursor-pointer rounded-none border-b-2 border-transparent data-[state=active]:border-sb-accent data-[state=active]:text-sb-accent text-sb-ink-muted hover:text-sb-ink data-[state=active]:bg-transparent"
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Panels */}
        <div className="flex flex-col gap-6 mt-6">
          <TabsContent
            value="profile"
            className="flex flex-col gap-6 outline-none"
          >
            <ProfileHeader
              data={profile.header}
              onUpdate={(fields) =>
                updateProfile({
                  ...profile,
                  header: { ...profile.header, ...fields },
                })
              }
              onPreviewResume={() => setShowResumePreview(true)}
            />
            <ProfileAbout
              data={profile.about}
              onUpdate={(fields) =>
                updateProfile({
                  ...profile,
                  about: { ...profile.about, ...fields },
                })
              }
            />
            <ProfileExperience
              experience={profile.experience}
              education={profile.education}
              onUpdateExperience={(exp) =>
                updateProfile({ ...profile, experience: exp })
              }
              onUpdateEducation={(edu) =>
                updateProfile({ ...profile, education: edu })
              }
            />
          </TabsContent>

          <TabsContent value="analytics" className="outline-none">
            <ProfileAnalytics
              stats={profile.stats}
              activities={profile.activities}
              achievements={profile.achievements}
            />
          </TabsContent>

          <TabsContent value="projects" className="outline-none">
            <ProfileProjects
              projects={profile.projects}
              research={profile.research}
              onUpdateProjects={(projs) =>
                updateProfile({ ...profile, projects: projs })
              }
              onUpdateResearch={(res) =>
                updateProfile({ ...profile, research: res })
              }
            />
          </TabsContent>

          <TabsContent value="skills" className="outline-none">
            <ProfileSkills
              skills={profile.skills}
              certifications={profile.certifications}
              onUpdateSkills={(sk) => updateProfile({ ...profile, skills: sk })}
              onUpdateCertifications={(certs) =>
                updateProfile({ ...profile, certifications: certs })
              }
            />
          </TabsContent>

          <TabsContent value="settings" className="outline-none">
            <ProfileSettings
              settings={profile.settings}
              onUpdateSettings={(sett) =>
                updateProfile({ ...profile, settings: sett })
              }
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Print-style Resume Preview Modal */}
      <Dialog open={showResumePreview} onOpenChange={setShowResumePreview}>
        <DialogContent className="w-full max-w-2xl p-5 flex flex-col gap-4 max-h-[90vh] bg-card border-card-border text-page-ink shadow-2xl">
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-sb-accent" />
              <DialogTitle className="font-bold text-sm text-page-ink font-serif">
                Resume Document Preview
              </DialogTitle>
            </div>
            <div className="flex items-center gap-1.5 pr-6">
              <Button
                size="xs"
                variant="outline"
                onClick={() => alert("Connecting to print device...")}
                className="gap-1.5 h-7 px-2 text-[11px]"
              >
                <Printer size={12} />
                Print
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() =>
                  alert(`Simulating download of ${profile.header.resumeName}`)
                }
                className="gap-1.5 h-7 px-2 text-[11px]"
              >
                <Download size={12} />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Resume Sheet Content (Simulating A4 print layout) */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="w-full rounded-lg border border-card-border p-8 flex flex-col gap-6 text-[12px] leading-relaxed bg-page-bg text-page-ink shadow-sm font-sans">
              {/* Header */}
              <div className="flex flex-col gap-1 border-b border-card-border pb-4 text-center">
                <h2 className="text-xl font-bold tracking-tight font-serif">
                  {profile.header.name}
                </h2>
                <p className="font-semibold text-xs text-sb-accent">
                  {profile.header.headline}
                </p>
                <p className="text-[10px] text-sb-ink-muted mt-1">
                  {profile.header.location} · {profile.header.email} ·{" "}
                  {profile.header.website}
                </p>
              </div>

              {/* Summary */}
              <div className="flex flex-col gap-1">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-sb-accent">
                  Professional Summary
                </h4>
                <p className="text-sb-ink">{profile.about.summary}</p>
              </div>

              {/* Experience */}
              <div className="flex flex-col gap-2">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-sb-accent border-b border-card-border pb-0.5">
                  Professional Experience
                </h4>
                <div className="flex flex-col gap-4">
                  {profile.experience.map((item, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-sb-ink">
                          {item.role} @ {item.company}
                        </span>
                        <span className="text-[10px] text-sb-ink-dim">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-sb-ink-muted">{item.description}</p>
                      {item.tech && item.tech.length > 0 && (
                        <p className="text-[10px] text-sb-ink-dim mt-0.5">
                          <b>Technologies:</b> {item.tech.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="flex flex-col gap-2">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-sb-accent border-b border-card-border pb-0.5">
                  Education
                </h4>
                <div className="flex flex-col gap-3">
                  {profile.education.map((item, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-sb-ink">{item.school}</span>
                        <span className="text-[10px] text-sb-ink-dim">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-sb-ink-muted">
                        {item.degree} {item.gpa && `· GPA: ${item.gpa}`}
                      </p>
                      {item.courses && (
                        <p className="text-[10px] text-sb-ink-dim">
                          <b>Selected Coursework:</b> {item.courses}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-2">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-sb-accent border-b border-card-border pb-0.5">
                  Skills & Tooling
                </h4>
                <div className="flex flex-col gap-1 text-[11px] text-sb-ink">
                  <p>
                    <b>Technical Skills:</b>{" "}
                    {profile.skills.technical.join(", ")}
                  </p>
                  <p>
                    <b>Tools & DevOps:</b> {profile.skills.tooling.join(", ")}
                  </p>
                  <p>
                    <b>Soft Skills:</b> {profile.skills.soft.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
