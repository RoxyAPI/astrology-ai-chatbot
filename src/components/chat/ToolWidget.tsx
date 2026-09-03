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
 * The wrapper package exports one component per name in the catalog, so the export
 * is looked up by name and handed the parsed result as `data`. Widgets follow the
 * chat theme through the `--roxy-*` tokens set in globals.css.
 */
export function ToolWidget({ widgets }: ToolWidgetProps) {
  if (widgets.length === 0) return null;

  return (
    <div className="mb-3 space-y-3">
      {widgets.map(({ key, pascal, attrs, data }) => {
        const Widget = RoxyUI[pascal as keyof typeof RoxyUI] as ElementType | undefined;
        if (!Widget) return null;

        return <Widget key={key} data={data} {...attrs} />;
      })}
    </div>
  );
}
