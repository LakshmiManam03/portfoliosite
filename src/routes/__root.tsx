import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-full gradient-bg px-5 py-2 text-sm font-medium text-white">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full gradient-bg px-5 py-2 text-sm font-medium text-white">Try again</button>
          <a href="/" className="rounded-full border border-border px-5 py-2 text-sm font-medium">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lakshmi Chaithanya — CSE Undergraduate & Full Stack Developer" },
      { name: "description", content: "Portfolio of Manam Lakshmi Chaithanya — Computer Science undergraduate at SVCE Tirupati, Python & Full Stack developer, AI enthusiast." },
      { name: "author", content: "Manam Lakshmi Chaithanya" },
      { property: "og:title", content: "Lakshmi Chaithanya — CSE Undergraduate & Full Stack Developer" },
      { property: "og:description", content: "Portfolio of Manam Lakshmi Chaithanya — Computer Science undergraduate at SVCE Tirupati, Python & Full Stack developer, AI enthusiast." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lakshmi Chaithanya — CSE Undergraduate & Full Stack Developer" },
      { name: "twitter:description", content: "Portfolio of Manam Lakshmi Chaithanya — Computer Science undergraduate at SVCE Tirupati, Python & Full Stack developer, AI enthusiast." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/92090360-3ae9-4582-bf47-5f617f85ed17/id-preview-07f8f372--e9b080fa-e189-45d1-a34d-b5b2a3b05927.lovable.app-1783149640833.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/92090360-3ae9-4582-bf47-5f617f85ed17/id-preview-07f8f372--e9b080fa-e189-45d1-a34d-b5b2a3b05927.lovable.app-1783149640833.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
