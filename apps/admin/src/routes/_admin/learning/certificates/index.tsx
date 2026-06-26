import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Check,
  Download,
  Eye,
  Loader2,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "#/components/admin/page-header";
import { Message, MessageContent } from "#/components/ai-elements/message";
import { Button } from "#/components/ui/button";
import {
  type CertTemplate,
  type LmsCertificate,
  useLmsCertificates,
  useLmsCourses,
  useSaveLmsCertificate,
} from "#/hooks/use-lms-state";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_admin/learning/certificates/")({
  component: LmsCertificatesPage,
});

interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function LmsCertificatesPage() {
  const { data: certificates = [], isLoading: isCertLoading } =
    useLmsCertificates();
  const { data: courses = [], isLoading: isCoursesLoading } = useLmsCourses();
  const saveCertificate = useSaveLmsCertificate();

  // Selected certificate for Live Modal editing
  const [modalCert, setModalCert] = useState<{
    certId: string;
    courseId: string;
    courseTitle: string;
    template: CertTemplate;
    autoIssue: boolean;
    issuedCount: number;
  } | null>(null);

  // Live Customizer Form Fields
  const [custRecipient, setCustRecipient] = useState("Jane Doe Student");
  const [custInstructor, setCustInstructor] = useState("Dr. Emily Smith");
  const [custDate, setCustDate] = useState("June 26, 2026");
  const [custVerifyId, setCustVerifyId] = useState("SECURE-982-LMS");
  const [custTemplate, setCustTemplate] = useState<CertTemplate>("modern");

  // Transition blur state when changing templates
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Staggered load animation
  const [animateIn, setAnimateIn] = useState(false);

  // AI Assistant drawer state
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am your LMS Certificate Assistant. You can ask me to change certificate designs, toggle automatic issuance, or generate credentials for any course using natural language.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // Trigger stagger entrance
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Group certificates by Course
  const courseCerts = useMemo(() => {
    return courses.map((c) => {
      const cert = certificates.find((cert) => cert.courseId === c.id) || {
        id: `cert_${c.id}`,
        courseId: c.id,
        template: "modern" as CertTemplate,
        autoIssue: false,
        issuedCount: 0,
        createdAt: new Date().toISOString(),
      };
      return { course: c, cert };
    });
  }, [courses, certificates]);

  const handleUpdateTemplate = (
    cert: LmsCertificate,
    template: CertTemplate,
  ) => {
    saveCertificate.mutate({
      ...cert,
      template,
    });
  };

  const handleToggleAutoIssue = (cert: LmsCertificate) => {
    saveCertificate.mutate({
      ...cert,
      autoIssue: !cert.autoIssue,
    });
  };

  // Live change within modal
  const handleModalTemplateChange = (val: CertTemplate) => {
    if (!modalCert) return;
    setIsTransitioning(true);
    setCustTemplate(val);

    // Save state back
    const matched = certificates.find(
      (c) => c.courseId === modalCert.courseId,
    ) || {
      id: modalCert.certId,
      courseId: modalCert.courseId,
      template: val,
      autoIssue: modalCert.autoIssue,
      issuedCount: modalCert.issuedCount,
      createdAt: new Date().toISOString(),
    };
    saveCertificate.mutate({ ...matched, template: val });

    setTimeout(() => {
      setIsTransitioning(false);
    }, 250); // blur mask transition duration
  };

  const handleSimulateDownload = () => {
    setDownloading(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloading(false);
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // AI command parser simulation
  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setChatMessages((prev) => [
      ...prev,
      { id: `user_${Date.now()}`, role: "user", content: userText },
    ]);
    setAiInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply =
        "I'm not sure how to perform that design change. You can try: 'make javascript certificate classic', 'enable auto issue for python', or 'set minimal template'.";
      let actionTaken = false;

      // Match JavaScript Mastery commands
      if (lower.includes("javascript") || lower.includes("js")) {
        const jsCourse = courses.find((c) =>
          c.title.toLowerCase().includes("javascript"),
        );
        if (jsCourse) {
          const cert = certificates.find(
            (ct) => ct.courseId === jsCourse.id,
          ) || {
            id: `cert_${jsCourse.id}`,
            courseId: jsCourse.id,
            template: "modern" as CertTemplate,
            autoIssue: false,
            issuedCount: 287,
            createdAt: new Date().toISOString(),
          };

          if (lower.includes("classic")) {
            saveCertificate.mutate({ ...cert, template: "classic" });
            reply =
              "Updated 'Complete JavaScript Mastery' certificate design to 'Classic Scroll'.";
            actionTaken = true;
          } else if (lower.includes("minimal")) {
            saveCertificate.mutate({ ...cert, template: "minimal" });
            reply =
              "Updated 'Complete JavaScript Mastery' certificate design to 'Minimal Slate'.";
            actionTaken = true;
          } else if (lower.includes("modern")) {
            saveCertificate.mutate({ ...cert, template: "modern" });
            reply =
              "Updated 'Complete JavaScript Mastery' certificate design to 'Modern Glass'.";
            actionTaken = true;
          }

          if (lower.includes("auto") || lower.includes("issue")) {
            const currentAuto = cert.autoIssue;
            saveCertificate.mutate({ ...cert, autoIssue: !currentAuto });
            reply = `Toggled automatic issuance for 'Complete JavaScript Mastery' course. It is now ${
              !currentAuto ? "Enabled" : "Disabled"
            }.`;
            actionTaken = true;
          }
        }
      }

      // Match Python commands
      if (lower.includes("python") || lower.includes("data science")) {
        const pyCourse = courses.find((c) =>
          c.title.toLowerCase().includes("python"),
        );
        if (pyCourse) {
          const cert = certificates.find(
            (ct) => ct.courseId === pyCourse.id,
          ) || {
            id: `cert_${pyCourse.id}`,
            courseId: pyCourse.id,
            template: "modern" as CertTemplate,
            autoIssue: false,
            issuedCount: 142,
            createdAt: new Date().toISOString(),
          };

          if (lower.includes("classic")) {
            saveCertificate.mutate({ ...cert, template: "classic" });
            reply =
              "Updated 'Python for Data Science' certificate design to 'Classic Scroll'.";
            actionTaken = true;
          } else if (lower.includes("minimal")) {
            saveCertificate.mutate({ ...cert, template: "minimal" });
            reply =
              "Updated 'Python for Data Science' certificate design to 'Minimal Slate'.";
            actionTaken = true;
          } else if (lower.includes("modern")) {
            saveCertificate.mutate({ ...cert, template: "modern" });
            reply =
              "Updated 'Python for Data Science' certificate design to 'Modern Glass'.";
            actionTaken = true;
          }

          if (lower.includes("auto") || lower.includes("issue")) {
            const currentAuto = cert.autoIssue;
            saveCertificate.mutate({ ...cert, autoIssue: !currentAuto });
            reply = `Toggled automatic issuance for 'Python for Data Science' course. It is now ${
              !currentAuto ? "Enabled" : "Disabled"
            }.`;
            actionTaken = true;
          }
        }
      }

      if (
        !actionTaken &&
        (lower.includes("auto issue") || lower.includes("auto-issue"))
      ) {
        reply =
          "Please specify which course. For example: 'enable auto issue for javascript'.";
      }

      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        { id: `assist_${Date.now()}`, role: "assistant", content: reply },
      ]);
    }, 1200);
  };

  const isLoading = isCertLoading || isCoursesLoading;

  return (
    <div className="p-6 w-full pb-16 space-y-8 relative overflow-x-hidden">
      {/* Page Header with AI trigger */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <PageHeader
            title="Certificates Configuration"
            description="Design templates, manage automatic certificate issuance upon course completion, and review credentials."
            icon={Award}
            breadcrumbs={[
              { label: "Admin" },
              { label: "Learning" },
              { label: "Certificates" },
            ]}
          />
        </div>

        <button
          type="button"
          onClick={() => setAiDrawerOpen(true)}
          className="h-9 px-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/25 active:scale-[0.97] transition-all cursor-pointer w-fit"
        >
          <Sparkles size={14} className="animate-pulse" />
          AI Designer Assistant
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="border rounded-xl p-6 h-56 animate-pulse"
              style={{ borderColor: "var(--sb-border)" }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courseCerts.map(({ course, cert }, idx) => {
            const assignedInstructor = course.instructorIds?.[0]
              ? "Dr. Emily Smith"
              : "Jessica Zhang";

            return (
              <div
                key={course.id}
                className={cn(
                  "island-shell rounded-xl p-5 border flex flex-col justify-between space-y-4 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200",
                  animateIn
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2",
                )}
                style={{
                  borderColor: "var(--sb-border)",
                  background: "transparent",
                  transitionDelay: `${idx * 80}ms`,
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500">
                        {course.category}
                      </span>
                      <h3
                        className="font-semibold text-xs text-foreground mt-0.5"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {course.title}
                      </h3>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold text-[9px] capitalize shrink-0">
                      {course.difficulty}
                    </span>
                  </div>

                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span>
                      {cert.issuedCount ?? 0} credentials issued to date
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Template Selection */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <Settings size={10} />
                        Design Template
                      </span>
                      <select
                        value={cert.template}
                        onChange={(e) =>
                          handleUpdateTemplate(
                            cert,
                            e.target.value as CertTemplate,
                          )
                        }
                        className="w-full text-[10px] border rounded-lg px-2.5 py-1.5 bg-background focus:outline-none focus:border-ring font-normal active:scale-[0.98] transition-transform"
                        style={{
                          borderColor: "var(--sb-border)",
                          color: "var(--sb-ink)",
                        }}
                      >
                        <option value="classic">Classic Scroll</option>
                        <option value="modern">Modern Glass</option>
                        <option value="minimal">Minimal Slate</option>
                      </select>
                    </div>

                    {/* Auto Issue Toggle */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase block">
                        Auto-Issuance
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleAutoIssue(cert)}
                        className={cn(
                          "w-full flex items-center justify-between text-[10px] border rounded-lg px-2.5 py-1.5 transition-all cursor-pointer font-medium active:scale-[0.97]",
                          cert.autoIssue
                            ? "border-emerald-500 bg-emerald-500/[0.03] text-emerald-500"
                            : "hover:border-(--sb-ink-dim) text-muted-foreground",
                        )}
                        style={{
                          borderColor: cert.autoIssue
                            ? undefined
                            : "var(--sb-border)",
                        }}
                      >
                        <span>{cert.autoIssue ? "Active" : "Disabled"}</span>
                        {cert.autoIssue && <Check size={12} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className="pt-4 border-t flex items-center justify-between"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  <div className="text-[10px] text-muted-foreground">
                    ID: <span className="font-mono">{cert.id}</span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setCustRecipient("Jane Doe Student");
                      setCustInstructor(assignedInstructor);
                      setCustVerifyId(`VERIFY-${cert.id.toUpperCase()}`);
                      setCustDate(
                        new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }),
                      );
                      setCustTemplate(cert.template);
                      setModalCert({
                        certId: cert.id,
                        courseId: course.id,
                        courseTitle: course.title,
                        template: cert.template,
                        autoIssue: cert.autoIssue,
                        issuedCount: cert.issuedCount,
                      });
                    }}
                    size="sm"
                    variant="outline"
                    className="text-[10px] h-8 gap-1.5 active:scale-[0.97]"
                  >
                    <Eye size={12} />
                    Preview & Customize
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Live Customizer & Preview Modal */}
      {modalCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setModalCert(null)}
          />

          <div
            className="relative w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
            style={{
              background: "var(--sb-background, #fff)",
              border: "1px solid var(--sb-border)",
              height: "85vh",
              maxHeight: "680px",
            }}
          >
            {/* Left Column: Customizer Controls */}
            <div
              className="w-full md:w-80 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r overflow-y-auto shrink-0"
              style={{
                borderColor: "var(--sb-border)",
                background: "color-mix(in oklab, var(--sb-bg) 98%, black 2%)",
              }}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-[12px] text-indigo-500 uppercase tracking-wide">
                    Live Customizer
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Tweak and adjust certificate variables live.
                  </p>
                </div>

                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Recipient Name</span>
                  <input
                    value={custRecipient}
                    onChange={(e) => setCustRecipient(e.target.value)}
                    placeholder="Student Name"
                    className="mt-1 block w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-ring font-normal"
                    style={{
                      background: "transparent",
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </label>

                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Signee / Instructor</span>
                  <input
                    value={custInstructor}
                    onChange={(e) => setCustInstructor(e.target.value)}
                    placeholder="Instructor Name"
                    className="mt-1 block w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-ring font-normal"
                    style={{
                      background: "transparent",
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                    <span>Issue Date</span>
                    <input
                      value={custDate}
                      onChange={(e) => setCustDate(e.target.value)}
                      placeholder="June 26, 2026"
                      className="mt-1 block w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-ring font-normal"
                      style={{
                        background: "transparent",
                        borderColor: "var(--sb-border)",
                        color: "var(--sb-ink)",
                      }}
                    />
                  </label>
                  <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                    <span>Template Style</span>
                    <select
                      value={custTemplate}
                      onChange={(e) =>
                        handleModalTemplateChange(
                          e.target.value as CertTemplate,
                        )
                      }
                      className="mt-1 block w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none focus:border-ring font-normal"
                      style={{
                        borderColor: "var(--sb-border)",
                        color: "var(--sb-ink)",
                      }}
                    >
                      <option value="classic">Classic Scroll</option>
                      <option value="modern">Modern Glass</option>
                      <option value="minimal">Minimal Slate</option>
                    </select>
                  </label>
                </div>

                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Verification ID</span>
                  <input
                    value={custVerifyId}
                    onChange={(e) => setCustVerifyId(e.target.value)}
                    placeholder="VERIFY-XX"
                    className="mt-1 block w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-ring font-normal"
                    style={{
                      background: "transparent",
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </label>
              </div>

              <div
                className="pt-4 border-t space-y-2 shrink-0"
                style={{ borderColor: "var(--sb-border)" }}
              >
                {downloading ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase">
                      <span>Generating PDF</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-100"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSimulateDownload}
                    className="w-full text-xs gap-1.5 active:scale-[0.97]"
                  >
                    <Download size={14} />
                    Download PDF
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalCert(null)}
                  className="w-full text-xs active:scale-[0.97]"
                >
                  Close Editor
                </Button>
              </div>
            </div>

            {/* Right Column: Interactive Certificate Render */}
            <div className="flex-1 flex flex-col justify-between p-6">
              {/* Header inside modal */}
              <div
                className="flex justify-between items-center pb-3 border-b"
                style={{ borderColor: "var(--sb-border)" }}
              >
                <div>
                  <h4
                    className="font-semibold text-xs"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    {modalCert.courseTitle}
                  </h4>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    Live layout and print preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalCert(null)}
                  className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Styled Certificate Canvas */}
              <div className="my-auto py-4">
                <div
                  className={cn(
                    "p-1 border rounded-lg transition-all duration-300",
                    isTransitioning
                      ? "filter blur-[2px] opacity-75"
                      : "filter blur-0 opacity-100",
                  )}
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  {custTemplate === "classic" && (
                    <div className="border-[8px] border-amber-800 bg-[#fdfaf2] p-8 text-center text-[#402008] space-y-6 relative overflow-hidden font-serif">
                      <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-800/30" />
                      <Award size={32} className="mx-auto text-amber-700" />
                      <div className="text-base font-bold tracking-widest uppercase">
                        Certificate of Completion
                      </div>
                      <div className="text-[9px] italic">
                        This is proudly presented to
                      </div>
                      <div className="text-lg font-bold border-b border-amber-800/40 pb-1 max-w-sm mx-auto">
                        {custRecipient}
                      </div>
                      <div className="text-[8px] max-w-md mx-auto leading-relaxed">
                        for successfully demonstrating mastery and completing
                        all requirements for the course
                      </div>
                      <div className="text-xs font-extrabold tracking-wide uppercase">
                        {modalCert.courseTitle}
                      </div>
                      <div className="flex justify-between text-[7px] pt-6 max-w-xs mx-auto">
                        <div>
                          <div className="border-t border-amber-800/40 pt-1 font-bold">
                            {custInstructor}
                          </div>
                          <div className="text-[#402008]/70 mt-0.5">
                            Instructor
                          </div>
                        </div>
                        <div>
                          <div className="border-t border-amber-800/40 pt-1 font-bold">
                            {custDate}
                          </div>
                          <div className="text-[#402008]/70 mt-0.5">
                            Date Issued
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {custTemplate === "modern" && (
                    <div className="border-2 border-indigo-500/20 bg-gradient-to-br from-slate-900 to-indigo-950 p-8 text-center text-slate-100 space-y-6 relative overflow-hidden rounded-md font-sans">
                      <div className="absolute -top-12 -left-12 size-36 bg-indigo-500/20 rounded-full blur-3xl" />
                      <div className="absolute -bottom-12 -right-12 size-36 bg-blue-500/20 rounded-full blur-3xl" />

                      <Award size={32} className="mx-auto text-indigo-400" />
                      <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                        Quild Learning Platform
                      </div>
                      <div className="text-base font-bold tracking-wide">
                        CERTIFICATE OF MASTERSHIP
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Awarded to
                      </div>
                      <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-200 max-w-sm mx-auto py-0.5">
                        {custRecipient}
                      </div>
                      <div className="text-[8px] text-slate-400 max-w-md mx-auto">
                        in recognition of their dedicated study and completion
                        of the curriculum
                      </div>
                      <div className="text-xs font-semibold text-indigo-200 italic">
                        "{modalCert.courseTitle}"
                      </div>
                      <div className="flex justify-between text-[7px] pt-6 max-w-xs mx-auto text-slate-400">
                        <div>
                          <div className="text-slate-200 font-semibold">
                            {custInstructor}
                          </div>
                          <div>Authorized Signature</div>
                        </div>
                        <div>
                          <div className="text-slate-200 font-semibold">
                            {custDate}
                          </div>
                          <div>Verification: {custVerifyId}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {custTemplate === "minimal" && (
                    <div className="border border-slate-200 bg-white p-8 text-left text-slate-900 space-y-6 relative rounded-md font-sans">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                          CREDENTIAL
                        </span>
                        <Award size={18} className="text-slate-800" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-semibold tracking-tight text-slate-800">
                          Certificate of Achievement
                        </div>
                        <div className="text-[8px] text-slate-500">
                          This confirms completion of a curriculum of technical
                          studies.
                        </div>
                      </div>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold">
                              Recipient
                            </div>
                            <div className="text-xs font-bold text-slate-800">
                              {custRecipient}
                            </div>
                          </div>
                          <div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold">
                              Course Title
                            </div>
                            <div className="text-xs font-semibold text-slate-800">
                              {modalCert.courseTitle}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold">
                              Instructor
                            </div>
                            <div className="text-xs font-semibold text-slate-800">
                              {custInstructor}
                            </div>
                          </div>
                          <div>
                            <div className="text-[8px] text-slate-400 uppercase font-bold">
                              Issued Date
                            </div>
                            <div className="text-xs font-semibold text-slate-800">
                              {custDate}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-[7px] pt-6 text-slate-400 border-t border-slate-100">
                        <div>ISSUED BY QUILD LMS</div>
                        <div>VERIFICATION ID: {custVerifyId}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Info bar */}
              <div
                className="pt-4 border-t flex items-center justify-between text-[10px] text-muted-foreground"
                style={{ borderColor: "var(--sb-border)" }}
              >
                <div className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <span>Secure credential hashes applied to PDF output</span>
                </div>
                <span>
                  Auto-issue: {modalCert.autoIssue ? "Active" : "Off"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Drawer - Sliding in from right */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 w-80 h-screen shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          aiDrawerOpen ? "translate-x-0" : "translate-x-full",
        )}
        style={{
          background: "var(--sb-background, #fff)",
          borderLeft: "1px solid var(--sb-border)",
        }}
      >
        {/* Chat Drawer Header */}
        <div
          className="p-4 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: "var(--sb-border)" }}
        >
          <div className="flex items-center gap-1.5 text-indigo-500">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              AI Design Agent
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAiDrawerOpen(false)}
            className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Chat History Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none"
          style={{
            background: "color-mix(in oklab, var(--sb-bg) 99%, black 1%)",
          }}
        >
          {chatMessages.map((msg) => (
            <Message from={msg.role} key={msg.id}>
              <MessageContent
                className={cn(
                  "p-3 rounded-lg text-xs leading-relaxed max-w-[85%]",
                  msg.role === "user"
                    ? "bg-indigo-600 text-white ml-auto rounded-br-none"
                    : "bg-muted text-foreground border rounded-bl-none",
                )}
                style={{
                  borderColor:
                    msg.role === "assistant" ? "var(--sb-border)" : undefined,
                }}
              >
                {msg.content}
              </MessageContent>
            </Message>
          ))}

          {isTyping && (
            <Message from="assistant">
              <MessageContent className="p-3 rounded-lg text-xs bg-muted text-muted-foreground border rounded-bl-none flex items-center gap-1">
                <Loader2
                  size={12}
                  className="animate-spin text-indigo-500 shrink-0"
                />
                <span>Analyzing prompt settings…</span>
              </MessageContent>
            </Message>
          )}
        </div>

        {/* Input Prompter */}
        <form
          onSubmit={handleSendAiMessage}
          className="p-3 border-t flex gap-2 items-center shrink-0"
          style={{ borderColor: "var(--sb-border)" }}
        >
          <input
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="E.g., set js course to classic template"
            className="flex-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-ring"
            style={{
              background: "transparent",
              borderColor: "var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
          <button
            type="submit"
            disabled={!aiInput.trim()}
            className="size-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center active:scale-95 transition-transform shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <Send size={12} />
          </button>
        </form>
      </div>
    </div>
  );
}
