import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The palette, in both themes, and the bridge that hands it to the drawn results.
 *
 * A half finished recolour is invisible until somebody opens the chatbot in the other theme, so
 * every palette token is asserted in both blocks. The components that draw a tool result read their
 * own `--roxy-*` tokens, and every surface, ink, border, status colour, face and corner they paint
 * comes from one of them: pointing the whole set at the palette is what makes a drawn chart part of
 * the chat rather than a card dropped into it. A colour written into the bridge instead of a
 * reference is the failure worth catching, because it looks right in one theme and wrong in the
 * other.
 */

const css = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8');

function block(selector: string): string {
  const match = css.match(new RegExp(`\\n${selector.replace('.', '\\.')} \\{([\\s\\S]*?)\\n\\}`));
  if (!match) throw new Error(`No ${selector} block in globals.css`);
  return match[1];
}

const light = block(':root');
const dark = block('.dark');
const theme = css.match(/@theme inline \{([\s\S]*?)\n\}/)?.[1] ?? '';

/** Every palette token, each of which has to carry its own value in each theme. */
const PALETTE = [
  'background',
  'foreground',
  'foreground-soft',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'success',
  'success-ink',
  'warning',
  'warning-ink',
  'destructive',
  'destructive-ink',
  'info',
  'info-ink',
  'border',
  'input',
  'ring',
];

describe('the palette is complete in both themes', () => {
  for (const token of PALETTE) {
    it(`${token} is declared in light`, () => {
      expect(light).toMatch(new RegExp(`--${token}:\\s*#[0-9A-Fa-f]{6};`));
    });

    it(`${token} is declared in dark`, () => {
      expect(dark).toMatch(new RegExp(`--${token}:\\s*#[0-9A-Fa-f]{6};`));
    });
  }

  it('picks the dark values rather than inverting the light ones', () => {
    const value = (source: string, token: string) =>
      source.match(new RegExp(`--${token}:\\s*(#[0-9A-Fa-f]{6});`))?.[1];
    // The two themes swap the role of the accent pair, which an inversion cannot produce: deep ink
    // on paper by day, warm gold on night after dark.
    expect(value(light, 'primary')).not.toBe(value(dark, 'primary'));
    expect(value(light, 'accent')).not.toBe(value(dark, 'accent'));
  });

  it('declares the layout values the screen is built from', () => {
    expect(light).toContain('--header-h:');
    expect(light).toContain('--radius:');
  });
});

/** Every `--roxy-*` token, and the app token it must read rather than restate. */
const BRIDGE: Record<string, string> = {
  'roxy-bg': 'background',
  'roxy-surface': 'card',
  'roxy-fg': 'card-foreground',
  'roxy-primary': 'card-foreground',
  'roxy-secondary': 'foreground-soft',
  'roxy-muted': 'muted-foreground',
  'roxy-border': 'border',
  'roxy-accent': 'primary',
  'roxy-success': 'success',
  'roxy-success-fg': 'success-ink',
  'roxy-warning': 'warning',
  'roxy-warning-fg': 'warning-ink',
  'roxy-danger': 'destructive',
  'roxy-danger-fg': 'destructive-ink',
  'roxy-info': 'info',
  'roxy-info-fg': 'info-ink',
};

describe('the drawn tool results follow the palette', () => {
  for (const [roxy, app] of Object.entries(BRIDGE)) {
    it(`${roxy} reads the ${app} token rather than a value of its own`, () => {
      expect(light).toMatch(new RegExp(`--${roxy}:\\s*var\\(--${app}[,)]`));
    });
  }

  // Setting one of these would break a derivation the library depends on: the ink and the focus
  // ring follow the accent, and the heat ramp follows the danger colour.
  for (const derived of ['roxy-accent-ink', 'roxy-ring', 'roxy-heat']) {
    it(`${derived} is left to derive rather than pinned`, () => {
      expect(css).not.toMatch(new RegExp(`--${derived}:`));
    });
  }

  it('never pins a colour of its own anywhere in the stylesheet', () => {
    const pinned = [...css.matchAll(/--roxy-[a-z-]+:\s*([^;]+);/g)].filter(([, value]) =>
      /#[0-9A-Fa-f]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(|\blab\(/.test(value),
    );
    expect(pinned.map(([line]) => line.trim())).toEqual([]);
  });

  it('is declared once, because the dark block already moves what it points at', () => {
    expect(dark).not.toContain('--roxy-');
  });

  it('draws in the same faces the prose beside it is set in', () => {
    expect(light).toContain('--roxy-font-sans: var(--font-app);');
    expect(light).toContain('--roxy-font-display: var(--font-app-display);');
    expect(light).toContain('--roxy-font-mono: var(--font-app-mono);');
  });

  it('names those faces once, where the utilities read them too', () => {
    expect(light).toMatch(/--font-app:\s*var\(--font-sans-var\)/);
    expect(light).toMatch(/--font-app-display:\s*var\(--font-display-var\)/);
    expect(light).toMatch(/--font-app-mono:\s*[^;]+;/);
    expect(theme).toContain('--font-sans: var(--font-app);');
    expect(theme).toContain('--font-display: var(--font-app-display);');
    expect(theme).toContain('--font-mono: var(--font-app-mono);');
  });

  it('separates surfaces with a hairline rather than a shadow, like the rest of the chat', () => {
    for (const step of ['sm', 'md', 'lg']) {
      expect(light).toMatch(new RegExp(`--roxy-shadow-${step}:\\s*none;`));
    }
  });

  /**
   * The radius scale is stated twice, once for Tailwind and once for the components, because the
   * theme block is inlined into utilities and cannot be read at runtime. A test between the two is
   * what makes writing a ratio twice safe.
   */
  it('draws its corners from the same radius scale the rest of the app uses', () => {
    for (const [roxyStep, appStep] of [
      ['sm', 'sm'],
      ['lg', '2xl'],
    ] as const) {
      const ratio = theme.match(
        new RegExp(`--radius-${appStep}:\\s*calc\\(var\\(--radius\\) \\* ([0-9.]+)\\)`),
      )?.[1];
      expect(ratio).toBeDefined();
      expect(light).toContain(`--roxy-radius-${roxyStep}: calc(var(--radius) * ${ratio});`);
    }
    expect(light).toContain('--roxy-radius-md: var(--radius);');
    expect(theme).toContain('--radius-lg: var(--radius);');
  });
});

describe('the measure of the transcript is declared once', () => {
  it('globals.css declares .thread-measure', () => {
    expect(css).toContain('.thread-measure {');
    expect(css).toMatch(/\.thread-measure \{[\s\S]*?max-w-3xl/);
  });

  it('nothing else in the chat declares its own transcript width', () => {
    const files = ['ChatShell', 'ChatPanel', 'ChatHeader', 'MessageList', 'MessageBubble'].map(
      (name) => join(process.cwd(), 'src', 'components', 'chat', `${name}.tsx`),
    );
    const offenders = files.filter((file) => /max-w-(3xl|4xl|5xl|screen)/.test(readFileSync(file, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
