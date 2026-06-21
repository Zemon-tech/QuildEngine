import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, memo, useCallback, useMemo } from "react";
import {
  Mic,
  Calendar,
  AlertTriangle,
  MessageSquare,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  History,
  SquarePen,
  CheckIcon,
  GlobeIcon,
  PanelLeft,
} from "lucide-react";
import { cn } from "#/lib/utils.ts";
import { toggleAiDashboardSidebar } from "#/components/sidebar/secondary-sidebar.tsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "#/components/ai-elements/attachments.tsx";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "#/components/ai-elements/model-selector.tsx";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  type PromptInputMessage,
} from "#/components/ai-elements/prompt-input.tsx";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "#/components/ai-elements/message.tsx";
import { nanoid } from "nanoid";

export const Route = createFileRoute("/_app/dashboard/ai-dashboard")({
  component: AIDashboardPage,
});

const models = [
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-4o",
    name: "GPT-4o",
    providers: ["openai", "azure"],
  },
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    providers: ["openai", "azure"],
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-opus-4-20250514",
    name: "Claude 4 Opus",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-sonnet-4-20250514",
    name: "Claude 4 Sonnet",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    chef: "Google",
    chefSlug: "google",
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    providers: ["google"],
  },
];

interface AttachmentItemProps {
  attachment: {
    id: string;
    type: "file";
    filename?: string;
    mediaType?: string;
    url: string;
  };
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id]
  );
  const data = useMemo(() => ({
    ...attachment,
    mediaType: attachment.mediaType ?? "application/octet-stream",
  }), [attachment]);
  return (
    <Attachment data={data} key={attachment.id} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  );
});

AttachmentItem.displayName = "AttachmentItem";

interface ModelItemProps {
  m: (typeof models)[0];
  selectedModel: string;
  onSelect: (id: string) => void;
}

const ModelItem = memo(({ m, selectedModel, onSelect }: ModelItemProps) => {
  const handleSelect = useCallback(() => onSelect(m.id), [onSelect, m.id]);
  return (
    <ModelSelectorItem key={m.id} onSelect={handleSelect} value={m.id}>
      <ModelSelectorLogo provider={m.chefSlug} />
      <ModelSelectorName>{m.name}</ModelSelectorName>
      <ModelSelectorLogoGroup>
        {m.providers.map((provider) => (
          <ModelSelectorLogo key={provider} provider={provider} />
        ))}
      </ModelSelectorLogoGroup>
      {selectedModel === m.id ? (
        <CheckIcon className="ml-auto size-4" />
      ) : (
        <div className="ml-auto size-4" />
      )}
    </ModelSelectorItem>
  );
});

ModelItem.displayName = "ModelItem";

const PromptInputAttachmentsDisplay = memo(() => {
  const attachments = usePromptInputAttachments();

  const handleRemove = useCallback(
    (id: string) => attachments.remove(id),
    [attachments]
  );

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments className="mb-1.5 px-0" variant="inline">
      {attachments.files.map((attachment) => (
        <AttachmentItem
          attachment={attachment}
          key={attachment.id}
          onRemove={handleRemove}
        />
      ))}
    </Attachments>
  );
});

PromptInputAttachmentsDisplay.displayName = "PromptInputAttachmentsDisplay";

interface LocalMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

interface DashboardPromptInputProps {
  onSubmit: (msg: PromptInputMessage) => void;
  className?: string;
  status: "ready" | "submitted" | "streaming" | "error";
  placeholder?: string;
}

const DashboardPromptInput = memo(
  ({ onSubmit, className, status, placeholder = "How can I help you today?" }: DashboardPromptInputProps) => {
    const [model, setModel] = useState<string>(models[0].id);
    const [modelSelectorOpen, setModelSelectorOpen] = useState(false);

    const selectedModelData = models.find((m) => m.id === model);

    const handleModelSelect = useCallback((id: string) => {
      setModel(id);
      setModelSelectorOpen(false);
    }, []);

    return (
      <PromptInputProvider>
        <PromptInput
          globalDrop
          multiple
          onSubmit={onSubmit}
          className={cn(
            "w-full [&>div]:border-none! [&>div]:bg-transparent! [&>div]:shadow-none! [&>div]:ring-0! [&>div]:outline-none!",
            className
          )}
        >
          <PromptInputAttachmentsDisplay />
          <PromptInputBody>
            <PromptInputTextarea
              className="w-full bg-transparent text-foreground border-0 resize-none focus-visible:ring-0 text-[14px] leading-relaxed placeholder:text-muted-foreground min-h-[56px] max-h-[160px] scrollbar-none py-1.5 px-0"
              placeholder={placeholder}
            />
          </PromptInputBody>
          <PromptInputFooter className="flex items-center justify-between mt-1.5 px-0 pb-0">
            <PromptInputTools className="flex items-center gap-1.5 flex-wrap">
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger className="rounded-full border border-border bg-secondary/40 hover:bg-secondary/80 hover:text-foreground text-muted-foreground size-8 transition-all cursor-pointer active:scale-95 shrink-0 flex items-center justify-center" />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                  <PromptInputActionAddScreenshot />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>

              <PromptInputButton className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border bg-secondary/40 text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all text-xs cursor-pointer active:scale-95 shrink-0">
                <GlobeIcon size={13} />
                <span>Search</span>
              </PromptInputButton>

              <ModelSelector
                onOpenChange={setModelSelectorOpen}
                open={modelSelectorOpen}
              >
                <ModelSelectorTrigger asChild>
                  <PromptInputButton className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border bg-secondary/40 text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all text-xs cursor-pointer active:scale-95 shrink-0">
                    {selectedModelData?.chefSlug && (
                      <ModelSelectorLogo
                        provider={selectedModelData.chefSlug}
                      />
                    )}
                    {selectedModelData?.name && (
                      <ModelSelectorName className="text-foreground">
                        {selectedModelData.name}
                      </ModelSelectorName>
                    )}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {["OpenAI", "Anthropic", "Google"].map((chef) => (
                      <ModelSelectorGroup heading={chef} key={chef}>
                        {models
                          .filter((m) => m.chef === chef)
                          .map((m) => (
                            <ModelItem
                              key={m.id}
                              m={m}
                              onSelect={handleModelSelect}
                              selectedModel={model}
                            />
                          ))}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>

            <div className="flex items-center gap-1.5">
              <PromptInputButton
                tooltip="Use voice input"
                className="flex items-center justify-center rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground size-8 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <Mic size={15} />
              </PromptInputButton>
              <PromptInputSubmit
                status={status}
                className="flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 size-8 transition-all cursor-pointer active:scale-95 shrink-0 [&_svg]:text-primary-foreground"
              />
            </div>
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    );
  }
);

DashboardPromptInput.displayName = "DashboardPromptInput";

function AIDashboardPage() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming" | "error">("ready");
  const [userName, setUserName] = useState("Shivang");
  const [time, setTime] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load user name from local storage
  useEffect(() => {
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem("quild_user_profile");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) {
            setUserName(parsed.name.split(" ")[0]);
          }
        }
      } catch (e) {
        console.error("Failed to load user profile:", e);
      }
    };
    loadProfile();
    window.addEventListener("storage", loadProfile);
    return () => window.removeEventListener("storage", loadProfile);
  }, []);

  // Update ticking clock
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      let hours = d.getHours();
      const minutes = d.getMinutes();
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minStr = minutes < 10 ? "0" + minutes : minutes;
      setTime(`${hours}:${minStr} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  const getFormattedDate = () => {
    const d = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
  };

  const handleNewChat = () => {
    setMessages([]);
    setStatus("ready");
  };

  const handleSubmitPrompt = async (message: PromptInputMessage) => {
    const prompt = message.text.trim();
    if (!prompt && message.files?.length === 0) return;

    // Add user message
    const userMsg: LocalMessage = {
      id: nanoid(),
      role: "user",
      content: prompt,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setStatus("submitted");

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Choose answer response
    const isSpanishGreeting = prompt.toLowerCase().includes("hola");
    const fullText = isSpanishGreeting
      ? "¡Hola! ¿En qué puedo ayudarte hoy?\n\nVeo que estás revisando tu sección de notas en Motion. Si necesitas que busquemos alguna nota en particular, redactemos un borrador, o coordinemos tus tareas y calendario, dímelo y nos ponemos a trabajar en ello."
      : `Hello ${userName}! I see you're currently reviewing the focus area in your Workspace Dashboard. \n\nI can help you manage your outline notes, write drafts, synchronize tasks, or analyze your current learning progress. Let me know what you would like to tackle first!`;

    const assistantMsgId = nanoid();
    const assistantMsg: LocalMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setStatus("streaming");

    // Stream the text chunk-by-word
    let currentText = "";
    const words = fullText.split(" ");
    let wordIndex = 0;

    const streamInterval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: currentText } : msg
          )
        );
        wordIndex++;
      } else {
        clearInterval(streamInterval);
        setStatus("ready");
      }
    }, 45);
  };

  const isChatActive = messages.length > 0;

  if (isChatActive) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col bg-background text-foreground">
        {/* Header toolbar */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAiDashboardSidebar}
              className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer active:scale-95"
              title="Toggle Sidebar"
            >
              <PanelLeft size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewChat}
              className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer active:scale-95"
              title="New Chat"
            >
              <SquarePen size={18} />
            </button>
            <button
              className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer active:scale-95"
              title="View History"
            >
              <History size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable message container */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-none">
          <div className="max-w-2xl w-full mx-auto space-y-6 flex flex-col">
            {messages.map((msg) => (
              <Message from={msg.role} key={msg.id}>
                <MessageContent>
                  {msg.role === "user" ? (
                    <span className="text-[14px] leading-relaxed">{msg.content}</span>
                  ) : (
                    <MessageResponse className="text-[14px] leading-relaxed text-foreground prose dark:prose-invert max-w-none">
                      {msg.content}
                    </MessageResponse>
                  )}
                </MessageContent>
              </Message>
            ))}

            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent>
                  <div className="flex items-center gap-1.5 py-2 px-1 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </MessageContent>
              </Message>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Fixed bottom input container */}
        <div className="shrink-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-6 pb-6 px-4">
          <div className="max-w-2xl w-full mx-auto flex flex-col gap-3">
            <DashboardPromptInput
              onSubmit={handleSubmitPrompt}
              status={status}
              placeholder="Write a message..."
              className="w-full rounded-2xl border border-border bg-card px-3 pt-2.5 pb-2.5 focus-within:border-ring [&_[data-slot=input-group]]:border-none [&_[data-slot=input-group]]:bg-transparent [&_[data-slot=input-group]]:shadow-none"
            />
            <div className="text-[10px] text-muted-foreground text-center select-none">
              Keil AI can make mistakes. Check important details.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No active chat - render backgrounds/lib-gate.png raw image layout (no overlays/gradients)
  return (
    <div className="absolute inset-0 z-10 flex flex-col text-white overflow-hidden select-none bg-black">
      {/* Background (No filters, no brightness adjustments, no custom scale shifts) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/backgrounds/lib-gate.png')",
        }}
      />

      {/* Sidebar toggle button in top-left */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={toggleAiDashboardSidebar}
          className="flex items-center justify-center p-2 rounded-lg text-zinc-300 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-xs border border-white/5 hover:border-white/10 transition-all cursor-pointer active:scale-95"
          title="Toggle Sidebar"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {/* History button in top-right */}
      <div className="absolute top-4 right-4 z-20">
        <button
          className="flex items-center justify-center p-2 rounded-lg text-zinc-300 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-xs border border-white/5 hover:border-white/10 transition-all cursor-pointer active:scale-95"
          title="View History"
        >
          <History size={18} />
        </button>
      </div>

      {/* Center content container */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 max-w-3xl w-full mx-auto pb-8"
        style={{
          transform: isExpanded ? "translateY(0)" : "translateY(-56px)",
          transition: "transform 550ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="w-full flex flex-col items-center text-center mb-2">
          <h1
            className="text-white text-4xl md:text-5xl lg:text-[3.25rem] font-medium tracking-tight mb-3 drop-shadow-md select-none"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {getGreeting()}, {userName}
          </h1>
        </div>

        {/* Prompt Input (relative z-20 to sit on top of sliding panel) */}
        <div className="w-full relative z-20">
          <DashboardPromptInput
            onSubmit={handleSubmitPrompt}
            status={status}
            className="w-full rounded-2xl border border-border bg-card px-3.5 pt-3 pb-3 shadow-lg focus-within:border-ring [&_[data-slot=input-group]]:border-none [&_[data-slot=input-group]]:bg-transparent [&_[data-slot=input-group]]:shadow-none"
          />
        </div>

        {/* Sliding Dashboard Panel (relative z-10 with negative margin) */}
        <div className="w-full relative z-10 -mt-5">
          <motion.div
            initial={{ height: 58, opacity: 0 }}
            animate={{ height: isExpanded ? "auto" : 58, opacity: 1 }}
            transition={{ type: "spring", stiffness: 170, damping: 24 }}
            className="w-full bg-muted/95 backdrop-blur-md border border-border border-t-0 rounded-b-[1.25rem] overflow-hidden shadow-2xl"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {!isExpanded ? (
                <motion.div
                  key="minimized"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-between px-5 pt-[26px] pb-[10px] h-[58px] text-[13px] text-muted-foreground select-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[13px] font-medium tracking-wide">
                      Workspace Status: <strong className="text-foreground font-normal">0 urgent</strong> • <strong className="text-foreground font-normal">0 replies</strong> • <strong className="text-foreground font-normal">2 queued</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer text-muted-foreground text-[13px] font-semibold"
                  >
                    View snapshot
                    <ChevronDown size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 pb-6.5 pt-8 flex flex-col"
                >
                  {/* Header row when expanded */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                      Workspace Dashboard
                    </span>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer text-muted-foreground text-[13px] font-semibold"
                    >
                      Minimize
                      <ChevronUp size={14} />
                    </button>
                  </div>

                  {/* 3 Columns Dashboard Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
                    {/* Column 1 - Current Focus */}
                    <div className="flex flex-col justify-between pr-4 h-full min-h-[90px]">
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase mb-3 flex items-center justify-between">
                          <span>Current Focus</span>
                          <span className="text-[9px] font-semibold px-2 py-0.2 rounded-md border border-border bg-secondary text-muted-foreground">
                            Medium
                          </span>
                        </div>
                        <div className="flex justify-between items-center w-full mt-1.5">
                          <div className="space-y-1 pr-2">
                            <div className="text-sm font-semibold text-foreground leading-tight">
                              Test Event Sync Outbound
                            </div>
                            <div className="text-xs text-muted-foreground">Due today • Todo</div>
                          </div>
                          {/* Dotted scroll track */}
                          <div className="flex flex-col gap-1 shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/80" />
                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 - Time & Date */}
                    <div className="flex flex-col justify-between px-4 h-full min-h-[90px] border-l border-border">
                      <div className="flex items-center gap-2 text-foreground text-xs">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span>{getFormattedDate()}</span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:border-emerald-950 dark:bg-emerald-950/20 text-[10px] font-medium scale-95 origin-left">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          Live
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-foreground tracking-tight my-1 select-none">
                        {time}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Workspace snapshot
                      </div>
                    </div>

                    {/* Column 3 - Counter Badges */}
                    <div className="flex flex-col gap-2 pl-4 h-full justify-center border-l border-border select-none">
                      {/* Urgent Counter */}
                      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-secondary/30 border border-border text-xs hover:bg-secondary/50 transition-all text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-red-500/10 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-400 shrink-0">
                            <AlertTriangle size={12} />
                          </div>
                          <span>Urgent</span>
                        </div>
                        <span className="font-semibold">{0}</span>
                      </div>

                      {/* Replies Counter */}
                      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-secondary/30 border border-border text-xs hover:bg-secondary/50 transition-all text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-blue-500/10 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                            <MessageSquare size={12} />
                          </div>
                          <span>Replies</span>
                        </div>
                        <span className="font-semibold">{0}</span>
                      </div>

                      {/* Queued Counter */}
                      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-secondary/30 border border-border text-xs hover:bg-secondary/50 transition-all text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                            <CheckSquare size={12} />
                          </div>
                          <span>Queued</span>
                        </div>
                        <span className="font-semibold">{2}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
