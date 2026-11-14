"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompletionRateByClass from "@/components/charts/completion-rate-by-class"
import PerformanceDistribution from "@/components/charts/performance-distribution"
import GenderPerformance from "@/components/charts/gender-performance"
import ClassPerformanceTrend from "@/components/charts/class-performance-trend"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"

interface CoachAnalyticsProps {
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

export default function CoachAnalytics({ participants }: CoachAnalyticsProps) {
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
  const totalParticipants = participants.length
  const completedParticipants = participants.filter((user) => user.termino === "Sí").length
  const completionRate = (completedParticipants / totalParticipants) * 100

  // Gender distribution
  const maleParticipants = participants.filter((user) => user.genero === "M").length
  const femaleParticipants = participants.filter((user) => user.genero === "F").length

  // Best performers
  const bestMale = participants.find((user) => user.ranking_por_sexo === "M1")
  const bestFemale = participants.find((user) => user.ranking_por_sexo === "F1")

  // Athletes data sorted by ranking
  const sortedAthletes = [...participants].sort((a, b) => {
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de finalización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {completedParticipants} de {totalParticipants} participantes completaron
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejor tiempo masculino</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestMale?.tiempo || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{bestMale?.nombre || "No hay datos"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejor tiempo femenino</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestFemale?.tiempo || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{bestFemale?.nombre || "No hay datos"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="classes">Por Clase</TabsTrigger>
          <TabsTrigger value="gender">Por Género</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Distribución de rendimiento</CardTitle>
                <CardDescription>Tiempos agrupados por rango</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PerformanceDistribution participants={participants} />
              </CardContent>
            </Card>
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Tasa de finalización por clase</CardTitle>
                <CardDescription>Porcentaje de participantes que completaron</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <CompletionRateByClass participants={participants} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de rendimiento por clase</CardTitle>
              <CardDescription>Tiempos promedio, mejores y peores por clase</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ClassPerformanceTrend participants={participants} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="gender" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparación por género</CardTitle>
              <CardDescription>Tiempos promedio y mejores por género</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <GenderPerformance participants={participants} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todos los participantes</CardTitle>
              <CardDescription>Clasificados por tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead className="min-w-[180px]">Participante</TableHead>
                    {!isMobile && <TableHead>Clase</TableHead>}
                    {!isMobile && <TableHead>Género</TableHead>}
                    <TableHead className="text-right">Tiempo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAthletes.map((athlete) => (
                    <React.Fragment key={athlete.nombre}>
                      <TableRow 
                        className={athlete.termino === "No" ? "text-muted-foreground" : undefined}
                        onClick={() => isMobile ? toggleExpandAthlete(athlete.ranking_general) : null}
                        style={isMobile ? { cursor: 'pointer' } : undefined}
                      >
                        <TableCell className="font-medium">
                          {athlete.ranking_general ?? "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{athlete.nombre}</span>
                            {isMobile && isAthleteExpanded(athlete.ranking_general) && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                <div>Clase: {getClassTimeIcon(athlete.clase)} {athlete.clase}</div>
                                <div>Género: {athlete.genero === "M" ? "♂️ Masculino" : "♀️ Femenino"}</div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        {!isMobile && (
                          <TableCell>
                            {getClassTimeIcon(athlete.clase)} {athlete.clase}
                          </TableCell>
                        )}
                        {!isMobile && (
                          <TableCell>
                            {athlete.genero === "M" ? "♂️ Masculino" : "♀️ Femenino"}
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {isMobile && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpandAthlete(athlete.ranking_general);
                                }}
                                className="mr-2"
                              >
                                {isAthleteExpanded(athlete.ranking_general) ? 
                                  <ChevronUp className="h-4 w-4" /> : 
                                  <ChevronDown className="h-4 w-4" />
                                }
                              </button>
                            )}
                            <div className="flex items-center">
                              {athlete.termino === "Sí" ? (
                                <>
                                  <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{athlete.tiempo}</span>
                                </>
                              ) : (
                                <span title={`Último: ${athlete.ultimo_workout}`}>No completó</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

