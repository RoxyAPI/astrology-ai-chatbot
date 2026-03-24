"use client";

import type { UIMessage } from "ai";
import { Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const textContent = message.parts
    .filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("");

  if (!textContent) return null;

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
          isUser
            ? "bg-white/10 ring-1 ring-white/10"
            : "bg-roxy/15 ring-1 ring-roxy/25"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-zinc-400" />
        ) : (
          <Sparkles className="w-4 h-4 text-roxy" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-roxy-dim/80 text-white rounded-tr-md whitespace-pre-wrap"
            : "bg-white/5 ring-1 ring-white/8 text-zinc-200 rounded-tl-md"
        }`}
      >
        {isUser ? (
          textContent
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-zinc-100">{children}</strong>,
              em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
              h1: ({ children }) => <h1 className="text-lg font-bold text-zinc-100 mb-2 mt-3 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold text-zinc-100 mb-2 mt-3 first:mt-0">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-bold text-zinc-100 mb-1 mt-2 first:mt-0">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-3 last:mb-0 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 last:mb-0 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-zinc-200">{children}</li>,
              code: ({ className, children, ...props }) => {
                const isBlock = className?.includes("language-");
                if (isBlock) {
                  return (
                    <code className="block bg-white/5 rounded-lg px-3 py-2 my-2 text-xs font-mono overflow-x-auto text-zinc-300" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="bg-white/10 rounded px-1.5 py-0.5 text-xs font-mono text-roxy" {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => <pre className="mb-3 last:mb-0">{children}</pre>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-roxy/40 pl-3 my-2 text-zinc-400 italic">{children}</blockquote>
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-roxy hover:underline">
                  {children}
                </a>
              ),
              hr: () => <hr className="border-white/10 my-3" />,
              table: ({ children }) => (
                <div className="overflow-x-auto mb-3 last:mb-0">
                  <table className="min-w-full text-xs">{children}</table>
                </div>
              ),
              th: ({ children }) => <th className="px-2 py-1 text-left font-semibold text-zinc-100 border-b border-white/10">{children}</th>,
              td: ({ children }) => <td className="px-2 py-1 border-b border-white/5">{children}</td>,
            }}
          >
            {textContent}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
