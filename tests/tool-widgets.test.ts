import { describe, expect, it } from 'vitest';
import type { UIMessage } from 'ai';
import { toolWidgetsFor } from '@/lib/tool-widgets';

// The widget list is what turns a tool result into a chart, so the failure modes
// that matter are the silent ones: a tool nothing draws, a failed call, and a
// result that is not JSON must all leave the written answer standing rather than
// throwing inside the render. The name a vendor hands back is the only key, and
// one vendor prefixes it with the server it came from, so that form is pinned too.

let nextId = 0;

function message(parts: UIMessage['parts']): UIMessage {
  return { id: 'm1', role: 'assistant', parts };
}

function toolPart(
  toolName: string,
  output: unknown,
  toolCallId = `call-${nextId++}`
): UIMessage['parts'][number] {
  return { type: 'dynamic-tool', toolName, toolCallId, state: 'output-available', input: {}, output };
}

const tarotResult = { card: { name: 'The Star' } };
const tarotOutput = {
  content: [{ type: 'text', text: JSON.stringify(tarotResult) }],
};

describe('toolWidgetsFor', () => {
  it('returns nothing for a text-only message', () => {
    expect(toolWidgetsFor(message([{ type: 'text', text: 'Your card is The Star.' }]))).toEqual([]);
  });

  it('maps a completed tarot call to the component that draws it', () => {
    const widgets = toolWidgetsFor(message([toolPart('post_tarot_daily', tarotOutput, 'tarot-1')]));

    expect(widgets).toHaveLength(1);
    expect(widgets[0]).toMatchObject({
      key: 'tarot-1',
      pascal: 'RoxyTarotCard',
      data: tarotResult,
    });
  });

  it('resolves a server-prefixed tool name', () => {
    const widgets = toolWidgetsFor(
      message([toolPart('roxy_tarot:post_tarot_daily', tarotOutput)])
    );

    expect(widgets).toHaveLength(1);
    expect(widgets[0].pascal).toBe('RoxyTarotCard');
  });

  it('skips a failed tool call', () => {
    const widgets = toolWidgetsFor(
      message([toolPart('post_tarot_daily', { ...tarotOutput, isError: true })])
    );

    expect(widgets).toEqual([]);
  });

  it('skips a tool no component draws', () => {
    expect(toolWidgetsFor(message([toolPart('get_docs_search', tarotOutput)]))).toEqual([]);
  });

  it('skips a result that is not JSON', () => {
    const widgets = toolWidgetsFor(
      message([toolPart('post_tarot_daily', { content: [{ type: 'text', text: 'The Star' }] })])
    );

    expect(widgets).toEqual([]);
  });

  it('keeps the widget beside the prose of the same message', () => {
    const widgets = toolWidgetsFor(
      message([
        toolPart('post_tarot_daily', tarotOutput),
        { type: 'text', text: 'The Star speaks of renewed hope.' },
      ])
    );

    expect(widgets).toHaveLength(1);
  });

  // The message object is replaced on every streamed chunk. Parsing again each time
  // would hand the component a new object and redraw the whole chart under the
  // arriving prose, so the same call must always yield the same result object.
  it('hands back the same data object while a message is still streaming', () => {
    const parts = [toolPart('post_tarot_daily', tarotOutput, 'streaming-1')];
    const first = toolWidgetsFor(message(parts));
    const second = toolWidgetsFor(message([...parts, { type: 'text', text: 'Renewed hope.' }]));

    expect(second[0].data).toBe(first[0].data);
  });
});
