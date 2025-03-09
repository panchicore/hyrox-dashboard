"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { hyroxData } from "@/lib/data"
import CompletionRateByClass from "@/components/charts/completion-rate-by-class"
import PerformanceDistribution from "@/components/charts/performance-distribution"
import GenderPerformance from "@/components/charts/gender-performance"
import ClassPerformanceTrend from "@/components/charts/class-performance-trend"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"

export default function CoachAnalytics() {
  // Screen size state
  const [isMobile, setIsMobile] = useState(false)

  // Effect to detect screen size
  useEffect(() => {
    // Check initial screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // 768px is md breakpoint in Tailwind
    }
    
    // Set initial value
    checkScreenSize()
    
    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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

  // Athletes data sorted by ranking
  const sortedAthletes = [...hyroxData].sort((a, b) => {
    // Handle potentially null values
    const rankA = a.ranking_general || 9999
    const rankB = b.ranking_general || 9999
    return rankA - rankB
  })

  // State for expanded athlete rows (for mobile view)
  const [expandedAthletes, setExpandedAthletes] = useState<number[]>([])

  // Toggle expanded state for an athlete
  const toggleExpandAthlete = (rankingGeneral: number | null) => {
    if (rankingGeneral === null) return
    setExpandedAthletes((prev) =>
      prev.includes(rankingGeneral)
        ? prev.filter((id) => id !== rankingGeneral)
        : [...prev, rankingGeneral]
    )
  }

  // Function to check if an athlete is expanded
  const isAthleteExpanded = (rankingGeneral: number | null) => {
    if (rankingGeneral === null) return false
    return expandedAthletes.includes(rankingGeneral)
  }

  // Get class time icon
  const getClassTimeIcon = (classTime: string) => {
    const hour = parseInt(classTime.replace('AM', '').replace('PM', ''))
    const isAM = classTime.includes('AM')
    
    // Morning classes (5AM to 9AM)
    if (isAM) return "🌅"
    
    // Afternoon/Evening classes (4PM to 9PM)
    return "🌇"
  }

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

      {/* Athletes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Athletes</CardTitle>
          <CardDescription>Ranking y performance de los participantes</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Conditionally render either desktop or mobile table based on screen size */}
          {!isMobile ? (
            // Desktop View - Full Table
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tiempo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Clase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAthletes.map((athlete) => (
                  <TableRow key={`${athlete.nombre}-${athlete.ranking_general}-desktop`}>
                    <TableCell className="font-medium">{athlete.ranking_general}</TableCell>
                    <TableCell>{athlete.nombre}</TableCell>
                    <TableCell>{athlete.tiempo}</TableCell>
                    <TableCell>{athlete.ranking_por_sexo}</TableCell>
                    <TableCell>
                      <span title={athlete.clase}>
                        {getClassTimeIcon(athlete.clase)} {athlete.clase}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            // Mobile View - Simplified Table with Expand Option
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tiempo</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAthletes.map((athlete) => (
                  <React.Fragment key={`${athlete.nombre}-${athlete.ranking_general}-mobile`}>
                    <TableRow 
                      className="cursor-pointer"
                      onClick={() => toggleExpandAthlete(athlete.ranking_general)}
                    >
                      <TableCell className="font-medium">{athlete.ranking_general}</TableCell>
                      <TableCell>{athlete.nombre}</TableCell>
                      <TableCell>{athlete.tiempo}</TableCell>
                      <TableCell>
                        {isAthleteExpanded(athlete.ranking_general) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </TableCell>
                    </TableRow>
                    {isAthleteExpanded(athlete.ranking_general) && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={4} className="p-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Categoría:</span>
                              <span className="font-semibold">{athlete.ranking_por_sexo}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Clase:</span>
                              <span className="font-semibold">
                                {getClassTimeIcon(athlete.clase)} {athlete.clase}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Completó:</span>
                              <span className="font-semibold">{athlete.termino}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Δ vs #1:</span>
                              <span className="font-semibold">{athlete.delta_vs_1_min?.toFixed(1) || '-'} min</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
            <CardContent className="h-[450px] pt-4">
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
            <CardContent className="h-[450px] pt-4">
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
            <CardContent className="h-[450px] pt-4">
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
            <CardContent className="h-[450px] pt-4">
              <ClassPerformanceTrend />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

