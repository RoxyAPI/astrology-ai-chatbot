import type { UIMessage } from 'ai';
import { describe, expect, it } from 'vitest';
import {
  MAX_CONVERSATIONS,
  type StoredConversation,
  removeConversation,
  titleFor,
  upsertConversation,
} from '@/lib/conversations';

// History lives in the browser and nowhere else, so the list operations are where a defect would
// show up as a conversation quietly disappearing, or as the same one listed twice.

function said(role: UIMessage['role'], text: string): UIMessage {
  return { id: `${role}-${text}`, role, parts: [{ type: 'text', text }] };
}

function conversation(id: string, updatedAt = 0): StoredConversation {
  return { id, title: id, updatedAt, messages: [] };
}

describe('titleFor', () => {
  it('names a conversation after the first thing the person asked for', () => {
    expect(titleFor([said('user', 'Draw a card for today'), said('assistant', 'The Star')])).toBe(
      'Draw a card for today',
    );
  });

  it('skips a reply, so a conversation is never titled with the answer', () => {
    expect(titleFor([said('assistant', 'Welcome'), said('user', 'Read my birth chart')])).toBe(
      'Read my birth chart',
    );
  });

  it('shortens a long question rather than letting it push the list wide', () => {
    const title = titleFor([said('user', 'a'.repeat(200))]);
    expect(title.length).toBeLessThanOrEqual(63);
    expect(title.endsWith('...')).toBe(true);
  });

  it('has a name ready before anything has been said', () => {
    expect(titleFor([])).toBe('New conversation');
  });
});

describe('upsertConversation', () => {
  it('puts the newest conversation at the top', () => {
    const list = upsertConversation([conversation('older')], conversation('newer'));
    expect(list.map((entry) => entry.id)).toEqual(['newer', 'older']);
  });

  it('moves a conversation returned to rather than listing it twice', () => {
    const list = upsertConversation(
      [conversation('a'), conversation('b')],
      { ...conversation('b'), title: 'renamed' },
    );
    expect(list.map((entry) => entry.id)).toEqual(['b', 'a']);
    expect(list[0].title).toBe('renamed');
  });

  it('drops the oldest once the store is full, so a heavy day cannot fill the quota', () => {
    let list: StoredConversation[] = [];
    for (let index = 0; index < MAX_CONVERSATIONS + 5; index += 1) {
      list = upsertConversation(list, conversation(`c${index}`));
    }
    expect(list).toHaveLength(MAX_CONVERSATIONS);
    expect(list[0].id).toBe(`c${MAX_CONVERSATIONS + 4}`);
    expect(list.some((entry) => entry.id === 'c0')).toBe(false);
  });
});

describe('removeConversation', () => {
  it('removes only the one asked for', () => {
    const list = removeConversation([conversation('a'), conversation('b')], 'a');
    expect(list.map((entry) => entry.id)).toEqual(['b']);
  });
});
