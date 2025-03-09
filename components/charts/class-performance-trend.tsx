"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { hyroxData } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export default function ClassPerformanceTrend() {
  // Only include users who completed
  const completedUsers = hyroxData.filter((user) => user.termino === "Sí")

  // Get all unique class times
  const classes = [...new Set(completedUsers.map((user) => user.clase))]

  // Define the order of classes chronologically
  const classOrder = ["5AM", "6AM", "7AM", "8AM", "9AM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM"]

  // Sort classes chronologically
  const sortedClasses = classes.sort((a, b) => {
    return classOrder.indexOf(a) - classOrder.indexOf(b)
  })

  // Calculate average, best, and worst time for each class
  const data = sortedClasses.map((classTime) => {
    const classUsers = completedUsers.filter((user) => user.clase === classTime)

    // Calculate average time, handling potential null values
    const validTimes = classUsers.map(user => user.tiempo_segs).filter(time => time !== null) as number[]
    const avgTime = validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length / 60

    // Find best time (minimum), handling potential null values
    const bestTime = Math.min(...validTimes) / 60

    // Find worst time (maximum), handling potential null values
    const worstTime = Math.max(...validTimes) / 60

    // Count participants in this class
    const participantCount = classUsers.length

    return {
      clase: classTime,
      promedio: Number.parseFloat(avgTime.toFixed(2)),
      mejor: Number.parseFloat(bestTime.toFixed(2)),
      peor: Number.parseFloat(worstTime.toFixed(2)),
      participantes: participantCount,
    }
  })

  return (
    <div className="space-y-4">
      <ChartContainer
        config={{
          promedio: {
            label: "Tiempo promedio (min)",
            color: "hsl(var(--chart-1))",
          },
          mejor: {
            label: "Mejor tiempo (min)",
            color: "hsl(var(--success-500, 132, 204, 22))",
          },
          peor: {
            label: "Peor tiempo (min)",
            color: "hsl(var(--destructive))",
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 15, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="clase" 
              label={{ value: "Horario de clase", position: "insideBottom", offset: -5 }}
              tick={{ fontSize: 12 }} 
            />
            <YAxis
              label={{ value: "Minutos", angle: -90, position: "insideLeft" }}
              domain={["dataMin - 1", "dataMax + 1"]}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded p-2 shadow-md">
                      <p className="font-medium">Clase: {label}</p>
                      <p className="text-sm text-green-600">Mejor tiempo: {payload[0].value} min</p>
                      <p className="text-sm text-blue-600">Tiempo promedio: {payload[1].value} min</p>
                      <p className="text-sm text-red-600">Peor tiempo: {payload[2].value} min</p>
                      <p className="text-sm text-muted-foreground">Participantes: {payload[1].payload.participantes}</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="mejor"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 4, fill: "#22c55e" }}
              activeDot={{ r: 6 }}
              name="Mejor tiempo"
            />
            <Line
              type="monotone"
              dataKey="promedio"
              stroke="var(--color-promedio)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Tiempo promedio"
            />
            <Line
              type="monotone"
              dataKey="peor"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4, fill: "#ef4444" }}
              activeDot={{ r: 6 }}
              name="Peor tiempo"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <Card>
        <CardContent className="p-4 text-sm">
          <div className="flex items-start space-x-2">
            <TrendingUp className="w-5 h-5 mt-0.5 text-blue-500" />
            <div>
              <p className="font-medium">Interpretación del gráfico:</p>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>
                  <span className="font-medium text-green-600">Línea verde:</span> Muestra el mejor tiempo registrado en
                  cada clase
                </li>
                <li>
                  <span className="font-medium text-blue-600">Línea azul:</span> Muestra el tiempo promedio de todos los
                  participantes en cada clase
                </li>
                <li>
                  <span className="font-medium text-red-600">Línea roja:</span> Muestra el peor tiempo registrado en
                  cada clase
                </li>
              </ul>
              <p className="mt-2">
                Este gráfico permite analizar cómo varía el rendimiento a lo largo del día, desde las clases de la
                mañana hasta las de la noche. Una mayor distancia entre la línea verde y roja indica mayor variabilidad
                en el rendimiento de los participantes de esa clase.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

