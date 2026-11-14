"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CompletionRateByClassProps {
  participants: Array<{
    clase: string
    nombre: string
    tiempo: string
    tiempo_segs: number | null
    termino: string
    ultimo_workout: string
    genero: string
    ranking_general: number | null
    ranking_por_sexo: string | null
    delta_vs_1_min: number | null
    delta_vs_anterior_min: number | null
  }>
}

export default function CompletionRateByClass({ participants }: CompletionRateByClassProps) {
  // Get all unique class times
  const classes = [...new Set(participants.map((user) => user.clase))].sort()

  // Calculate completion rate for each class
  const data = classes.map((classTime) => {
    const classParticipants = participants.filter((user) => user.clase === classTime)
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
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="clase" tick={{ fontSize: 12 }} />
          <YAxis 
            domain={[0, 100]} 
            label={{ value: "%", angle: -90, position: "insideLeft" }} 
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="tasa" fill="var(--color-tasa)" radius={[4, 4, 0, 0]} name="Tasa de finalización" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

