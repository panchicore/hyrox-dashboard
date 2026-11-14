"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PerformanceDistributionProps {
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

export default function PerformanceDistribution({ participants }: PerformanceDistributionProps) {
  // Only include users who completed
  const completedUsers = participants.filter((user) => user.termino === "Sí")

  // Create time ranges (in minutes)
  const timeRanges = [
    { min: 20, max: 25, label: "20-25" },
    { min: 25, max: 30, label: "25-30" },
    { min: 30, max: 35, label: "30-35" },
    { min: 35, max: 40, label: "35-40" },
    { min: 40, max: 45, label: "40+" },
  ]

  // Count users in each time range
  const data = timeRanges.map((range) => {
    const count = completedUsers.filter((user) => {
      const timeInMinutes = user.tiempo_segs! / 60
      return timeInMinutes >= range.min && (range.max === 45 || timeInMinutes < range.max)
    }).length

    return {
      rango: range.label,
      cantidad: count,
    }
  })

  return (
    <ChartContainer
      config={{
        cantidad: {
          label: "Cantidad de participantes",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="rango" label={{ value: "Tiempo (min)", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: "Participantes", angle: -90, position: "insideLeft" }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="cantidad" fill="var(--color-cantidad)" radius={[4, 4, 0, 0]} name="Participantes" />
      </BarChart>
    </ChartContainer>
  )
}

