"use client"

import { PieChart, Pie, Cell } from "recharts"
import { ChartTooltip } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"

interface UserRankingPositionProps {
  ranking: number
  totalParticipants: number
  userTime: number
}

export default function UserRankingPosition({ 
  ranking, 
  totalParticipants, 
  userTime
}: UserRankingPositionProps) {
  // Calculate percentile (lower is better)
  const percentile = (ranking / totalParticipants) * 100
  const topPercentile = 100 - percentile

  const pieData = [
    { name: "Tu posición", value: 1, color: "hsl(var(--chart-1))" },
    { name: "Por delante", value: ranking - 1, color: "hsl(var(--chart-2))" },
    { name: "Por detrás", value: totalParticipants - ranking, color: "hsl(var(--chart-3))" },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-64 w-full">
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip />
          </PieChart>
        </div>
      </CardContent>
    </Card>
  )
}

