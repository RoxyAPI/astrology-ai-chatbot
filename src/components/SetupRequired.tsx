import { AlertCircle, ExternalLink } from "lucide-react";
import type { EnvStatus } from "@/lib/env";

interface SetupRequiredProps {
  status: EnvStatus;
}

/** What a reader sees before the keys are in place: what is missing, and where each one comes from. */
export function SetupRequired({ status }: SetupRequiredProps) {
  const missingCount = status.missing.length;

  return (
    <div className="relative z-10 mx-auto flex min-h-svh max-w-2xl flex-col px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-lg tracking-tight">Astrology Chatbot</h1>
        <p className="text-muted-foreground text-sm">Setup required</p>
      </header>

      <div className="border-warning/40 bg-warning/10 mb-6 rounded-xl border p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-warning-ink mt-0.5 size-5 shrink-0" />
          <div>
            <h2 className="text-warning-ink mb-1 text-base">
              {missingCount === 1 ? "1 API key missing" : `${missingCount} API keys missing`}
            </h2>
            <p className="text-foreground-soft text-sm">
              The chatbot needs the keys below before it can answer. Add them to{" "}
              <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">.env.local</code> in
              the project root and restart{" "}
              <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">npm run dev</code>.
            </p>
          </div>
        </div>
      </div>

      <ol className="mb-6 space-y-3">
        {status.missing.map((key, index) => (
          <li key={key.name} className="bg-card rounded-xl border p-5">
            <div className="mb-2 flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {index + 1}
              </span>
              <code className="font-mono text-sm break-all">{key.name}</code>
            </div>
            <p className="text-muted-foreground mb-3 ml-10 text-sm">{key.hint}</p>
            <a
              href={key.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary ml-10 inline-flex items-center gap-1.5 text-sm underline-offset-2 hover:underline"
            >
              Get key
              <ExternalLink className="size-3.5" />
            </a>
          </li>
        ))}
      </ol>

      <div className="bg-card rounded-xl border p-5">
        <h3 className="mb-3 text-sm">Add to .env.local</h3>
        <pre className="thin-scroll bg-muted overflow-x-auto rounded-lg p-4 font-mono text-xs">
          <code>{status.missing.map((key) => `${key.name}=your_real_key_here`).join("\n")}</code>
        </pre>
        <p className="text-muted-foreground mt-3 text-xs">
          The file loads automatically. If you already have an{" "}
          <code className="bg-muted rounded px-1 font-mono text-[11px]">.env</code> file, the values
          there work too. Restart{" "}
          <code className="bg-muted rounded px-1 font-mono text-[11px]">npm run dev</code> after
          saving.
        </p>
      </div>

      <footer className="text-muted-foreground mt-8 text-center text-xs">
        <p>
          See the{" "}
          <a
            href="https://github.com/RoxyAPI/astrology-ai-chatbot#quick-start"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            full quickstart
          </a>
          . LLM provider: <code className="font-mono">{status.provider}</code> (set{" "}
          <code className="font-mono">LLM_PROVIDER</code> to{" "}
          <code className="font-mono">gemini</code>, <code className="font-mono">anthropic</code> or{" "}
          <code className="font-mono">openai</code> to switch).
        </p>
      </footer>
    </div>
  );
}
