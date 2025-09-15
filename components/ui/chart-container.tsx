"use client"

import { ReactNode } from "react"

interface ChartContainerProps {
  children: ReactNode
  config: Record<string, { label: string; color: string }>
  className?: string
}

export function ChartContainer({ children, config, className = "" }: ChartContainerProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full">
        {children}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {Object.entries(config).map(([key, { label, color }]) => (
          <div key={key} className="flex items-center text-sm">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
