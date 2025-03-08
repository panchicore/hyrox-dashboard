"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { hyroxData } from "@/lib/data"

export default function CompletionRateByClass() {
  // Get all unique class times
  const classes = [...new Set(hyroxData.map((user) => user.clase))].sort()

  // Calculate completion rate for each class
  const data = classes.map((classTime) => {
    const classParticipants = hyroxData.filter((user) => user.clase === classTime)
    const completedParticipants = classParticipants.filter((user) => user.termino === "Sí")
    const completionRate = (completedParticipants.length / classParticipants.length) * 100

    return {
      clase: classTime,
      tasa: completionRate,
      participantes: classParticipants.length,
    }
  })

  return (
    <ChartContainer
      config={{
        tasa: {
          label: "Tasa de finalización (%)",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="clase" />
        <YAxis domain={[0, 100]} label={{ value: "%", angle: -90, position: "insideLeft" }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="tasa" fill="var(--color-tasa)" radius={[4, 4, 0, 0]} name="Tasa de finalización" />
      </BarChart>
    </ChartContainer>
  )
}

