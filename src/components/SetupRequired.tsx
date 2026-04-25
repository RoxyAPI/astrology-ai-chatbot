import type { EnvStatus } from "@/lib/env";
import { AlertCircle, ExternalLink, Sparkles } from "lucide-react";

interface SetupRequiredProps {
  status: EnvStatus;
}

export function SetupRequired({ status }: SetupRequiredProps) {
  const missingCount = status.missing.length;

  return (
    <div className="relative z-10 flex flex-col min-h-screen max-w-2xl mx-auto px-6 py-10">
      <header className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-roxy/15 ring-1 ring-roxy/25">
          <Sparkles className="w-5 h-5 text-roxy" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">
            AI Astrology Chatbot
          </h1>
          <p className="text-sm text-zinc-500">Setup required</p>
        </div>
      </header>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-base font-semibold text-zinc-100 mb-1">
              {missingCount === 1 ? "1 API key missing" : `${missingCount} API keys missing`}
            </h2>
            <p className="text-sm text-zinc-400">
              The chatbot needs the keys below before it can answer. Add them to{" "}
              <code className="bg-white/10 rounded px-1.5 py-0.5 text-xs font-mono">
                .env.local
              </code>{" "}
              in the project root and restart{" "}
              <code className="bg-white/10 rounded px-1.5 py-0.5 text-xs font-mono">
                npm run dev
              </code>
              .
            </p>
          </div>
        </div>
      </div>

      <ol className="space-y-3 mb-6">
        {status.missing.map((key, i) => (
          <li
            key={key.name}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-roxy/15 ring-1 ring-roxy/25 text-roxy text-sm font-semibold shrink-0">
                {i + 1}
              </span>
              <code className="text-sm font-mono text-zinc-100 break-all">
                {key.name}
              </code>
            </div>
            <p className="text-sm text-zinc-400 ml-10 mb-3">{key.hint}</p>
            <a
              href={key.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-10 inline-flex items-center gap-1.5 text-sm text-roxy hover:underline"
            >
              Get key
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
        ))}
      </ol>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-3">
          Add to .env.local
        </h3>
        <pre className="bg-black/50 rounded-lg p-4 text-xs font-mono text-zinc-300 overflow-x-auto">
          <code>
            {status.missing
              .map((k) => `${k.name}=your_real_key_here`)
              .join("\n")}
          </code>
        </pre>
        <p className="text-xs text-zinc-500 mt-3">
          The file loads automatically. If you already have an{" "}
          <code className="bg-white/10 rounded px-1 text-[11px] font-mono">.env</code>{" "}
          file, the values there work too. Restart{" "}
          <code className="bg-white/10 rounded px-1 text-[11px] font-mono">npm run dev</code>{" "}
          after saving.
        </p>
      </div>

      <footer className="mt-8 text-center text-xs text-zinc-600 space-y-1">
        <p>
          See the{" "}
          <a
            href="https://github.com/RoxyAPI/astrology-ai-chatbot#quick-start"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 underline"
          >
            full quickstart
          </a>
          {" · "}
          LLM provider:{" "}
          <code className="text-zinc-500 font-mono">{status.provider}</code>
          {" "}
          (set{" "}
          <code className="text-zinc-500 font-mono">LLM_PROVIDER</code> to{" "}
          <code className="text-zinc-500 font-mono">gemini</code> /{" "}
          <code className="text-zinc-500 font-mono">anthropic</code> /{" "}
          <code className="text-zinc-500 font-mono">openai</code> to switch)
        </p>
      </footer>
    </div>
  );
}
