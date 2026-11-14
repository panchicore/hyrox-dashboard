"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface GenderPerformanceProps {
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

export default function GenderPerformance({ participants }: GenderPerformanceProps) {
  // Only include users who completed
  const completedUsers = participants.filter((user) => user.termino === "Sí")

  // Calculate average times by gender
  const maleUsers = completedUsers.filter((user) => user.genero === "M")
  const femaleUsers = completedUsers.filter((user) => user.genero === "F")

  const maleAvgTime = maleUsers.reduce((sum, user) => sum + user.tiempo_segs!, 0) / maleUsers.length / 60
  const femaleAvgTime = femaleUsers.reduce((sum, user) => sum + user.tiempo_segs!, 0) / femaleUsers.length / 60

  // Get best times by gender
  const maleBestTime = Math.min(...maleUsers.map((user) => user.tiempo_segs!)) / 60
  const femaleBestTime = Math.min(...femaleUsers.map((user) => user.tiempo_segs!)) / 60

  const data = [
    {
      genero: "Masculino",
      promedio: maleAvgTime,
      mejor: maleBestTime,
    },
    {
      genero: "Femenino",
      promedio: femaleAvgTime,
      mejor: femaleBestTime,
    },
  ]

  return (
    <ChartContainer
      config={{
        promedio: {
          label: "Tiempo promedio (min)",
          color: "hsl(var(--chart-1))",
        },
        mejor: {
          label: "Mejor tiempo (min)",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="genero" />
        <YAxis label={{ value: "Tiempo (min)", angle: -90, position: "insideLeft" }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="promedio" fill="var(--color-promedio)" radius={[4, 4, 0, 0]} name="Promedio" />
        <Bar dataKey="mejor" fill="var(--color-mejor)" radius={[4, 4, 0, 0]} name="Mejor" />
      </BarChart>
    </ChartContainer>
  )
}

