"use client";

import * as RoxyUI from "@roxyapi/ui-react";
import type { ElementType } from "react";
import type { ToolWidgetSpec } from "@/lib/tool-widgets";

interface ToolWidgetProps {
  widgets: ToolWidgetSpec[];
}

/**
 * Draws the components a message earned from its tool calls, above the written answer.
 *
 * The wrapper package exports one component per name in the catalog, so the export is looked up by
 * name and handed the parsed result as `data`. Nothing here carries a colour: a drawing takes the
 * palette through the `--roxy-*` tokens in globals.css, so it is the same material as the reply
 * beside it. A drawing wider than the reply scrolls in its own frame rather than widening the page.
 */
export function ToolWidget({ widgets }: ToolWidgetProps) {
  if (widgets.length === 0) return null;

  return (
    <div className="thin-scroll mb-4 space-y-3 overflow-x-auto">
      {widgets.map(({ key, pascal, attrs, data }) => {
        const Widget = RoxyUI[pascal as keyof typeof RoxyUI] as ElementType | undefined;
        if (!Widget) return null;

        return <Widget key={key} data={data} {...attrs} />;
      })}
    </div>
  );
}
