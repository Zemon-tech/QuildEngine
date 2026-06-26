import { createRootRoute, HeadContent, Outlet, ScrollRestoration, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "#/components/ui/tooltip";

import appCss from "../style.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Quild Admin Panel" },
      {
        name: "description",
        content: "Quild Admin Panel — manage users, content, and platform settings.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body style={{ margin: 0 }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <TooltipProvider delayDuration={300}>
            {children}
            <ScrollRestoration />
            <TanStackRouterDevtools position="bottom-right" />
            <Scripts />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
