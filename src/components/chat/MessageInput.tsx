"use client";

import { ArrowUp, Square } from "lucide-react";
import { type RefObject, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  ref: RefObject<HTMLTextAreaElement | null>;
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  busy: boolean;
}

/** How tall the field grows before it starts scrolling instead. About six lines. */
const MAX_HEIGHT = 160;

/**
 * The composer.
 *
 * @remarks Height is set from the content rather than left to the browser, because the CSS that
 * does this natively is not in every browser yet and a field that grows in one and not another is
 * the kind of difference a forker inherits without being told.
 *
 * The send key is guarded against an input method editor: while a Japanese or Chinese candidate is
 * being chosen, the key that confirms the candidate is the same key that sends, and sending there
 * would cut the word in half.
 */
export function MessageInput({ ref, input, setInput, onSend, onStop, busy }: MessageInputProps) {
  useEffect(() => {
    const field = ref.current;
    if (!field) return;
    field.style.height = "0px";
    field.style.height = `${Math.min(field.scrollHeight, MAX_HEIGHT)}px`;
  }, [input, ref]);

  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
    >
      <Textarea
        ref={ref}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
          event.preventDefault();
          onSend();
        }}
        rows={1}
        aria-label="Message"
        // Short enough to sit on one line on a phone. A placeholder that wraps is a placeholder
        // with its second line cut off, because the field is sized from its value.
        placeholder="Ask for a reading"
        className="field-sizing-fixed bg-card max-h-40 min-h-11 resize-none py-2.5"
      />

      {busy ? (
        <Button
          type="button"
          size="icon-lg"
          variant="outline"
          aria-label="Stop the reply"
          onClick={onStop}
          className="size-11 shrink-0"
        >
          <Square className="size-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          size="icon-lg"
          aria-label="Send"
          disabled={input.trim().length === 0}
          className="size-11 shrink-0"
        >
          <ArrowUp className="size-4" />
        </Button>
      )}
    </form>
  );
}
