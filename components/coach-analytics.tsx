"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { hyroxData } from "@/lib/data"
import CompletionRateByClass from "@/components/charts/completion-rate-by-class"
import PerformanceDistribution from "@/components/charts/performance-distribution"
import GenderPerformance from "@/components/charts/gender-performance"
import ClassPerformanceTrend from "@/components/charts/class-performance-trend"

export default function CoachAnalytics() {
  // Calculate completion rate
  const totalParticipants = hyroxData.length
  const completedParticipants = hyroxData.filter((user) => user.termino === "Sí").length
  const completionRate = (completedParticipants / totalParticipants) * 100

  // Gender distribution
  const maleParticipants = hyroxData.filter((user) => user.genero === "M").length
  const femaleParticipants = hyroxData.filter((user) => user.genero === "F").length

  // Best performers
  const bestMale = hyroxData.find((user) => user.ranking_por_sexo === "M1")
  const bestFemale = hyroxData.find((user) => user.ranking_por_sexo === "F1")

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Finalización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {completedParticipants} de {totalParticipants} participantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distribución por Género</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <div className="text-xl font-bold">{maleParticipants}</div>
                <p className="text-xs text-muted-foreground">Hombres</p>
              </div>
              <div>
                <div className="text-xl font-bold">{femaleParticipants}</div>
                <p className="text-xs text-muted-foreground">Mujeres</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mejores Tiempos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">M: {bestMale?.nombre}</span>
                <span className="text-sm font-bold">{bestMale?.tiempo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">F: {bestFemale?.nombre}</span>
                <span className="text-sm font-bold">{bestFemale?.tiempo}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="completion" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="completion">Finalización</TabsTrigger>
          <TabsTrigger value="distribution">Distribución</TabsTrigger>
          <TabsTrigger value="gender">Género</TabsTrigger>
          <TabsTrigger value="class">Clases</TabsTrigger>
        </TabsList>

        <TabsContent value="completion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasa de Finalización por Clase</CardTitle>
              <CardDescription>Porcentaje de participantes que completaron por horario</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <CompletionRateByClass />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Rendimiento</CardTitle>
              <CardDescription>Distribución de tiempos de finalización</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <PerformanceDistribution />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gender" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Género</CardTitle>
              <CardDescription>Comparación de tiempos promedio por género</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <GenderPerformance />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="class" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia por Clase</CardTitle>
              <CardDescription>Tiempo promedio por horario de clase</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ClassPerformanceTrend />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

