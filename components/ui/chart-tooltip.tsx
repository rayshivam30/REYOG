"use client"

import { ReactNode } from "react"

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: any
    color: string
  }>
  label?: string
  content?: ReactNode
  formatter?: (value: number, name: string, entry: any) => [string, string]
}

export function ChartTooltip({ 
  active, 
  payload, 
  content,
  formatter = (value: number) => [value.toString(), '']
}: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null

  if (content) return <div className="bg-background border rounded-lg p-4 shadow-lg">{content}</div>

  return (
    <div className="bg-background border rounded-lg p-4 shadow-lg text-sm">
      <p className="font-medium mb-2">{payload[0].payload.name || payload[0].name}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const [value, unit] = formatter(entry.value, entry.name, entry)
          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
              <span className="font-medium">
                {value} {unit && <span className="text-muted-foreground">{unit}</span>}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
