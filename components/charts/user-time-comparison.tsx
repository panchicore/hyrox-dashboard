"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface UserTimeComparisonProps {
  userTime: number
  avgTime: number
  bestTime: number
}

export default function UserTimeComparison({ userTime, avgTime, bestTime }: UserTimeComparisonProps) {
  // Convert seconds to minutes for better visualization
  const userTimeMin = userTime / 60
  const avgTimeMin = avgTime / 60
  const bestTimeMin = bestTime / 60

  const data = [
    {
      name: "Tu tiempo",
      tiempo: userTimeMin,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "Promedio",
      tiempo: avgTimeMin,
      color: "hsl(var(--chart-2))",
    },
    {
      name: "Mejor tiempo",
      tiempo: bestTimeMin,
      color: "hsl(var(--chart-3))",
    },
  ]

  return (
    <ChartContainer
      config={{
        tiempo: {
          label: "Tiempo (min)",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Minutos", angle: -90, position: "insideLeft" }} domain={[0, "dataMax + 2"]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="tiempo" fill="var(--color-tiempo)" radius={[4, 4, 0, 0]} name="Tiempo (min)" />
      </BarChart>
    </ChartContainer>
  )
}

