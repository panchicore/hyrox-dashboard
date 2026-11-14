"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { InfoIcon, Clock, AlertTriangle, BarChartIcon } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { normalPDF, zScoreToPercentile, segsToMinutos } from "@/lib/stats"

interface UserPerformanceProps {
  selectedUser: string
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

// Helper function to convert seconds to MM:SS format
function formatTime(totalSeconds: number | null): string {
  if (totalSeconds === null) return "N/A"
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export default function UserPerformance({ selectedUser, participants }: UserPerformanceProps) {
  // Find the user's data
  const userData = participants.find((user) => user.nombre === selectedUser)

  if (!selectedUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento Individual</CardTitle>
          <CardDescription>Selecciona un participante para ver su rendimiento</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <BarChartIcon className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No hay participante seleccionado</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!userData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento Individual</CardTitle>
          <CardDescription>Participante no encontrado</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>No se encontró información para el participante seleccionado.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Calculate statistics and prepare chart data only if the user completed
  const completedWorkout = userData.termino === "Sí"

  // Get completed participants for comparisons
  const completedParticipants = participants.filter((p) => p.termino === "Sí")
  const totalCompletedParticipants = completedParticipants.length

  // Same gender stats
  const sameGenderParticipants = completedParticipants.filter((p) => p.genero === userData.genero)
  const totalSameGenderParticipants = sameGenderParticipants.length

  // Same class stats
  const sameClassParticipants = completedParticipants.filter((p) => p.clase === userData.clase)
  const totalSameClassParticipants = sameClassParticipants.length

  // Sections to show depend on whether user completed the workout
  const performanceStats = completedWorkout ? (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tiempo total:</span>
              <Badge variant="outline" className="text-lg font-bold">
                {userData.tiempo}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Posición general:</span>
              <span className="font-medium">{userData.ranking_general} de {totalCompletedParticipants}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Posición por género:</span>
              <span className="font-medium">{userData.ranking_por_sexo} de {totalSameGenderParticipants} {userData.genero === "M" ? "hombres" : "mujeres"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Diferencia vs. 1er lugar:</span>
              <span className="font-medium">{userData.delta_vs_1_min !== null ? `+${userData.delta_vs_1_min.toFixed(2)} min` : "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Diferencia vs. anterior:</span>
              <span className="font-medium">{userData.delta_vs_anterior_min !== null ? `+${userData.delta_vs_anterior_min.toFixed(2)} min` : "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Comparaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Clase:</span>
              <Badge variant="secondary">{userData.clase}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Vs. misma clase:</span>
              {sameClassParticipants.length > 0 ? (
                <span className="font-medium">
                  {sameClassParticipants.filter((p) => p.tiempo_segs! < userData.tiempo_segs!).length + 1} de{" "}
                  {sameClassParticipants.length}
                </span>
              ) : (
                <span className="text-muted-foreground">No hay datos</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Percentil general:</span>
              <span className="font-medium">
                {userData.ranking_general
                  ? `${Math.round(((totalCompletedParticipants - userData.ranking_general + 1) / totalCompletedParticipants) * 100)}%`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Percentil por género:</span>
              <span className="font-medium">
                {userData.ranking_por_sexo && userData.ranking_por_sexo.substring(1)
                  ? `${Math.round(
                      ((totalSameGenderParticipants - parseInt(userData.ranking_por_sexo.substring(1)) + 1) /
                        totalSameGenderParticipants) *
                        100
                    )}%`
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <Alert variant="default">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Progreso parcial</AlertTitle>
      <AlertDescription>
        El participante no completó la sesión. Último ejercicio: {userData.ultimo_workout}
      </AlertDescription>
    </Alert>
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{userData.nombre}</CardTitle>
            <CardDescription className="mt-1 flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
              <span>{userData.clase}</span>
              <Separator orientation="vertical" className="mx-2 h-3" />
              <Badge variant={userData.genero === "M" ? "secondary" : "destructive"}>
                {userData.genero === "M" ? "Masculino" : "Femenino"}
              </Badge>
            </CardDescription>
          </div>
          <Badge variant={completedWorkout ? "default" : "outline"} className="mt-1">
            {completedWorkout ? "Completado" : "Incompleto"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{performanceStats}</CardContent>
    </Card>
  )
}

