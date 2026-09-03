import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The components that draw a tool result read their own `--roxy-*` tokens, and every
 * surface, ink, border, status colour, face and corner they paint comes from one of
 * them. Pointing the whole set at the app palette is what makes a drawn chart part
 * of the chat rather than a card dropped into it, and a colour written here instead of
 * a reference is the failure worth catching: it survives a palette change and then
 * reads as a component from somewhere else.
 *
 * The app ships one theme, the dark one, so the bridge is declared once in `:root` and
 * the palette it points at lives in `.dark`. Both blocks land on the same element, so
 * every reference resolves against the values the app actually runs.
 */

const css = readFileSync(join(process.cwd(), 'src', 'app', 'globals.css'), 'utf8');

function block(selector: string): string {
  const match = css.match(new RegExp(`\\n${selector.replace('.', '\\.')} \\{([\\s\\S]*?)\\n\\}`));
  if (!match) throw new Error(`No ${selector} block in globals.css`);
  return match[1];
}

const root = block(':root');
const dark = block('.dark');
const theme = css.match(/@theme inline \{([\s\S]*?)\n\}/)?.[1] ?? '';

/** Every `--roxy-*` token, and the app token it must read rather than restate. */
const BRIDGE: Record<string, string> = {
  'roxy-bg': 'background',
  'roxy-surface': 'surface-panel',
  'roxy-fg': 'foreground-soft',
  'roxy-primary': 'foreground',
  'roxy-secondary': 'muted-foreground',
  'roxy-muted': 'muted-foreground',
  'roxy-border': 'border',
  'roxy-accent': 'accent-brand',
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
      expect(root).toMatch(new RegExp(`--${roxy}:\\s*var\\(--${app}[,)]`));
    });

    it(`${app} is declared somewhere the bridge can reach it`, () => {
      expect(`${root}${dark}`).toMatch(new RegExp(`--${app}:\\s*[^;]+;`));
    });
  }

  // Setting one of these would break a derivation the library depends on: the ink and
  // the focus ring follow the accent, and the heat ramp follows the danger colour.
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

  it('is declared once, because the palette it points at already moves with the theme', () => {
    expect(dark).not.toContain('--roxy-');
  });

  it('draws in the same faces the prose beside it is set in', () => {
    expect(root).toContain('--roxy-font-sans: var(--font-app);');
    expect(root).toContain('--roxy-font-mono: var(--font-app-mono);');
  });

  it('names those faces once, where the utilities read them too', () => {
    expect(root).toMatch(/--font-app:\s*[^;]+;/);
    expect(root).toMatch(/--font-app-mono:\s*[^;]+;/);
    expect(theme).toContain('--font-sans: var(--font-app);');
    expect(theme).toContain('--font-mono: var(--font-app-mono);');
  });

  it('separates surfaces with a hairline rather than a shadow, like the rest of the chat', () => {
    for (const step of ['sm', 'md', 'lg']) {
      expect(root).toMatch(new RegExp(`--roxy-shadow-${step}:\\s*none;`));
    }
  });

  /**
   * The radius scale is stated twice, once for Tailwind and once for the components,
   * because the theme block is inlined into utilities and cannot be read at runtime. A
   * test between the two is what makes writing a ratio twice safe.
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
      expect(root).toContain(`--roxy-radius-${roxyStep}: calc(var(--radius) * ${ratio});`);
    }
    expect(root).toContain('--roxy-radius-md: var(--radius);');
    expect(theme).toContain('--radius-lg: var(--radius);');
  });
});

describe('the brand accent has one home', () => {
  it('is declared in the palette, where a stylesheet and the bridge can both read it', () => {
    expect(root).toMatch(/--accent-brand:\s*oklch\([^;]+\);/);
    expect(root).toMatch(/--accent-brand-dim:\s*oklch\([^;]+\);/);
  });

  it('is what the roxy utilities paint with, rather than a second copy of the value', () => {
    expect(theme).toContain('--color-roxy: var(--accent-brand);');
    expect(theme).toContain('--color-roxy-dim: var(--accent-brand-dim);');
  });
});
