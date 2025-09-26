"use client"

import { cn } from "@/lib/utils"
import { Tooltip } from "recharts"

/**
 * @typedef {Object} ChartConfigItem
 * @property {string} label
 * @property {string} [color]
 */

/**
 * @typedef {Object.<string, ChartConfigItem>} ChartConfig
 */

export function ChartContainer({
  config,
  children,
  className,
}) {
  return (
    <div
      className={cn(
        "w-full h-full text-sm text-muted-foreground",
        className
      )}
      style={{
        "--chart-1": "var(--chart-1, hsl(224, 76%, 56%))",
        "--chart-2": "var(--chart-2, hsl(162, 84%, 39%))",
        "--chart-3": "var(--chart-3, hsl(334, 76%, 60%))",
        "--chart-4": "var(--chart-4, hsl(27, 98%, 57%))",
        "--chart-5": "var(--chart-5, hsl(265, 73%, 60%))",
        "--chart-6": "var(--chart-6, hsl(190, 77%, 50%))",
        "--chart-7": "var(--chart-7, hsl(46, 95%, 56%))",
        "--chart-8": "var(--chart-8, hsl(310, 95%, 62%))",
        "--chart-9": "var(--chart-9, hsl(350, 95%, 62%))",
        "--chart-10": "var(--chart-10, hsl(102, 62%, 46%))",
        ...Object.fromEntries(
          Object.entries(config || {}).flatMap(([key, value]) => {
            if (!value.color) {
              return []
            }

            return [[`--color-${key}`, value.color]]
          })
        )
      }}
    >
      {children}
    </div>
  )
}

export function ChartTooltip({
  content,
  ...props
}) {
  return (
    <Tooltip
      {...props}
      content={content}
      cursor={{ opacity: 0.5 }}
    />
  )
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  formatter,
  hideLabel,
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-background px-3 py-2 shadow-sm",
        className
      )}
    >
      {!hideLabel && (
        <div className="mb-1 font-medium">{label}</div>
      )}
      <div className="flex flex-col gap-0.5">
        {payload.map((data, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: data.payload.color,
              }}
            />
            <span className="font-medium">{data.name}</span>
            <span className="ml-auto font-mono text-xs">
              {formatter
                ? formatter(data.value)
                : data.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}