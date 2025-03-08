"use client"

import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "lucide-react"
import { hyroxData } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UserRankingPositionProps {
  ranking: number
  totalParticipants: number
  userTime: number
}

export default function UserRankingPosition({ ranking, totalParticipants, userTime }: UserRankingPositionProps) {
  // Calculate percentile (lower is better)
  const percentile = (ranking / totalParticipants) * 100
  const topPercentile = 100 - percentile

  const pieData = [
    { name: "Tu posición", value: 1, color: "hsl(var(--chart-1))" },
    { name: "Por delante", value: ranking - 1, color: "hsl(var(--chart-2))" },
    { name: "Por detrás", value: totalParticipants - ranking, color: "hsl(var(--chart-3))" },
  ]

  // Get all completed users for bell curve
  const completedUsers = hyroxData.filter((user) => user.termino === "Sí")

  // Calculate mean and standard deviation
  const times = completedUsers.map((user) => user.tiempo_segs / 60) // Convert to minutes
  const mean = times.reduce((sum, time) => sum + time, 0) / times.length
  const variance = times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / times.length
  const stdDev = Math.sqrt(variance)

  // Generate normal distribution curve data
  const generateNormalDistribution = () => {
    const minTime = Math.min(...times)
    const maxTime = Math.max(...times)
    const range = maxTime - minTime
    const padding = range * 0.2 // Add some padding

    const start = minTime - padding
    const end = maxTime + padding
    const step = range / 20 // 20 points on the curve

    const points = []
    for (let x = start; x <= end; x += step) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2))
      points.push({ x, y, isUser: false })
    }

    // Add user's time as a special point
    const userTimeMin = userTime / 60
    const userY = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((userTimeMin - mean) / stdDev, 2))

    // Find closest point to user's time
    let closestIndex = 0
    let minDiff = Math.abs(points[0].x - userTimeMin)

    for (let i = 1; i < points.length; i++) {
      const diff = Math.abs(points[i].x - userTimeMin)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    }

    // Replace closest point with user point
    points[closestIndex] = { x: userTimeMin, y: userY, isUser: true }

    return points
  }

  const bellCurveData = generateNormalDistribution()

  // Calculate z-score for user's time
  const userTimeMin = userTime / 60
  const zScore = (userTimeMin - mean) / stdDev

  // Interpret z-score
  let performance = ""
  if (zScore < -2) performance = "Excepcional (top 2.3%)"
  else if (zScore < -1) performance = "Muy bueno (top 16%)"
  else if (zScore < 0) performance = "Por encima del promedio"
  else if (zScore < 1) performance = "Por debajo del promedio"
  else if (zScore < 2) performance = "Necesita mejorar (bottom 16%)"
  else performance = "Muy por debajo del promedio (bottom 2.3%)"

  return (
    <div className="space-y-4">
      <Tabs defaultValue="bell" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pie">Gráfico Circular</TabsTrigger>
          <TabsTrigger value="bell">Campana de Gauss</TabsTrigger>
        </TabsList>

        <TabsContent value="pie" className="space-y-4">
          <ChartContainer
            config={{
              position: {
                label: "Posición",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]"
          >
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan x="50%" dy="-10" fontSize="16" fontWeight="bold">
                  {ranking}
                </tspan>
                <tspan x="50%" dy="20" fontSize="12">
                  de {totalParticipants}
                </tspan>
              </text>
            </PieChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="bell" className="space-y-4">
          <ChartContainer
            config={{
              distribution: {
                label: "Distribución",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]"
          >
            <AreaChart data={bellCurveData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="x"
                label={{ value: "Tiempo (min)", position: "insideBottom", offset: -5 }}
                domain={["dataMin", "dataMax"]}
                tickFormatter={(value) => value.toFixed(0)}
              />
              <YAxis hide />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded p-2 shadow-md">
                        <p className="font-medium">
                          {data.isUser ? "Tu tiempo" : "Tiempo"}: {data.x.toFixed(1)} min
                        </p>
                        {data.isUser && (
                          <p className="text-sm text-muted-foreground">
                            Posición: {ranking} de {totalParticipants}
                          </p>
                        )}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="y"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.3}
              />
              <ReferenceLine
                x={userTimeMin}
                stroke="red"
                strokeWidth={2}
                label={{
                  value: "Tu tiempo",
                  position: "top",
                  fill: "red",
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                x={mean}
                stroke="gray"
                strokeDasharray="3 3"
                label={{
                  value: "Promedio",
                  position: "top",
                  fill: "gray",
                  fontSize: 12,
                }}
              />
            </AreaChart>
          </ChartContainer>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-4 text-sm">
          <div className="flex items-start space-x-2">
            <BarChart className="w-5 h-5 mt-0.5 text-blue-500" />
            <div>
              <p className="font-medium">Análisis estadístico:</p>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>
                  Tu tiempo: <span className="font-medium">{(userTime / 60).toFixed(1)} minutos</span>
                </li>
                <li>
                  Tiempo promedio: <span className="font-medium">{mean.toFixed(1)} minutos</span>
                </li>
                <li>
                  Desviación estándar: <span className="font-medium">{stdDev.toFixed(1)} minutos</span>
                </li>
                <li>
                  Z-score: <span className="font-medium">{zScore.toFixed(2)}</span>
                </li>
              </ul>
              <p className="mt-2">
                Rendimiento: <span className="font-bold">{performance}</span>
              </p>
              <p className="mt-2">
                Estás en el <span className="font-bold">{topPercentile.toFixed(1)}%</span> superior de todos los
                participantes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

