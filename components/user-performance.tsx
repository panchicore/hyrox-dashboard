"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { InfoIcon, Clock, AlertTriangle, BarChartIcon } from "lucide-react"
import { hyroxData } from "@/lib/data"
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
}

export default function UserPerformance({ selectedUser }: UserPerformanceProps) {
  if (!selectedUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento Individual</CardTitle>
          <CardDescription>Selecciona un participante para ver sus estadísticas</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">No hay participante seleccionado</p>
        </CardContent>
      </Card>
    )
  }

  // Find user data
  const userData = hyroxData.find((user) => user.nombre === selectedUser)

  if (!userData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento Individual</CardTitle>
          <CardDescription>No se encontraron datos para este participante</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Calculate statistics
  const completedUsers = hyroxData.filter((user) => user.termino === "Sí")
  const times = completedUsers.map((user) => segsToMinutos(user.tiempo_segs || 0))
  const mean = times.reduce((sum, time) => sum + time, 0) / times.length
  const stdDev = Math.sqrt(times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / times.length)

  // Only calculate z-score and percentile if user completed
  let zScore = 0
  let percentile = 0
  let percentileText = ""
  let userTimeMin = 0

  if (userData.termino === "Sí") {
    userTimeMin = segsToMinutos(userData.tiempo_segs || 0)
    zScore = (userTimeMin - mean) / stdDev
    // Convert z-score to percentile (lower time is better, so we need to invert)
    percentile = zScoreToPercentile(-zScore)
    percentileText = percentile.toFixed(1)
  }

  // Performance rating based on z-score
  let performanceRating = ""
  let performanceColor = ""

  if (userData.termino === "Sí") {
    if (zScore <= -2) {
      performanceRating = "Excepcional"
      performanceColor = "text-green-600"
    } else if (zScore <= -1) {
      performanceRating = "Muy bueno"
      performanceColor = "text-green-500"
    } else if (zScore <= 0) {
      performanceRating = "Por encima del promedio"
      performanceColor = "text-blue-500"
    } else if (zScore <= 1) {
      performanceRating = "Por debajo del promedio"
      performanceColor = "text-yellow-500"
    } else {
      performanceRating = "Necesita mejorar"
      performanceColor = "text-red-500"
    }
  } else {
    performanceRating = "No completado"
    performanceColor = "text-gray-500"
  }

  // Generate bell curve data points
  const generateBellCurveData = () => {
    // Calculate min and max times from the actual data
    const allTimes = completedUsers.map(user => segsToMinutos(user.tiempo_segs || 0));
    const dataMin = Math.min(...allTimes);
    const dataMax = Math.max(...allTimes);
    
    // Add padding (20% on each side)
    const padding = (dataMax - dataMin) * 0.2;
    const minTime = Math.max(Math.floor(dataMin - padding), 0); // Ensure we don't go below 0
    const maxTime = Math.ceil(dataMax + padding);
    
    // Use appropriate step size based on the range
    const range = maxTime - minTime;
    const step = range <= 30 ? 0.5 : 1; // Smaller step for narrow ranges
    
    console.log(`Chart range: ${minTime} - ${maxTime}, Step: ${step}`);
    
    const points = [];
    for (let x = minTime; x <= maxTime; x += step) {
      const y = normalPDF(x, mean, stdDev);
      points.push({
        x,
        y,
        isUser: false
      });
    }
    
    // We don't need to add a special user point to the data array
    // We'll use ReferenceLine instead which is more reliable
    
    return {
      points,
      minTime,
      maxTime
    };
  };
  
  const { points: bellCurveData, minTime, maxTime } = generateBellCurveData();

  // Prepare workout comparison data
  const workoutData = [
    {
      name: "Tiempo (min)",
      tiempo: userTimeMin,
      promedio: mean,
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                {userData.nombre}
                {userData.termino === "Sí" && (
                  <Badge variant="outline" className="ml-2">
                    Ranking #{userData.ranking_general}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Clase: {userData.clase}</CardDescription>
            </div>
            {userData.termino === "Sí" ? (
              <Badge className="bg-green-500">Completado</Badge>
            ) : (
              <Badge variant="destructive">No completado</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resumen de rendimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tiempo y Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.termino === "Sí" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Tu tiempo</p>
                        <p className="text-2xl font-bold">{userData.tiempo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Promedio</p>
                        <p className="text-2xl font-bold">{mean.toFixed(1)} min</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">Rendimiento</p>
                        <p className={`text-sm font-bold ${performanceColor}`}>{performanceRating}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentile}%` }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Estás en el {percentileText}% superior de todos los participantes
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-muted-foreground">No completaste el evento</p>
                      <p className="text-sm text-muted-foreground mt-1">Último ejercicio: {userData.ultimo_workout}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <InfoIcon className="h-5 w-5" />
                  ¿Qué significa tu resultado?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.termino === "Sí" ? (
                  <>
                    <div>
                      <p className="text-sm font-medium mb-1">Variación respecto al promedio</p>
                      <p className="text-sm">
                        {Math.abs(zScore) > 0 ? (
                          <>
                            Tu tiempo está <span className="font-medium">{Math.abs(zScore).toFixed(1)} veces</span> la
                            <span className="font-medium"> variación típica </span>
                            {zScore < 0 ? (
                              <span className="text-green-600">por debajo</span>
                            ) : (
                              <span className="text-red-600">por encima</span>
                            )}{" "}
                            del promedio.
                          </>
                        ) : (
                          <>Tu tiempo está exactamente en el promedio.</>
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">En términos simples</p>
                      <p className="text-sm">
                        {zScore <= -2 ? (
                          <>
                            Estás entre el <span className="font-bold text-green-600">top 2.3%</span> de todos los
                            participantes. ¡Rendimiento excepcional!
                          </>
                        ) : zScore <= -1 ? (
                          <>
                            Estás entre el <span className="font-bold text-green-500">top 16%</span> de todos los
                            participantes. ¡Muy buen rendimiento!
                          </>
                        ) : zScore <= 0 ? (
                          <>
                            Estás en la <span className="font-bold text-blue-500">mitad superior</span> de todos los
                            participantes. Buen trabajo.
                          </>
                        ) : zScore <= 1 ? (
                          <>
                            Estás en la <span className="font-bold text-yellow-500">mitad inferior</span> de todos los
                            participantes. Hay margen de mejora.
                          </>
                        ) : (
                          <>
                            Estás entre el <span className="font-bold text-red-500">16% inferior</span> de todos los
                            participantes. Enfócate en mejorar.
                          </>
                        )}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <p className="text-muted-foreground text-center">
                      No hay datos de rendimiento disponibles porque no completaste el evento.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          {userData.termino === "Sí" && (
            <>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg">Comparación de tiempo</CardTitle>
                  <CardDescription>Tu tiempo comparado con el promedio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ChartContainer
                      config={{
                        tiempo: {
                          label: "Tu tiempo",
                          color: "hsl(var(--chart-1))",
                        },
                        promedio: {
                          label: "Tiempo promedio",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={workoutData} 
                          layout="vertical"
                          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            type="number"
                            tickFormatter={(value) => `${value.toFixed(0)} min`}
                            domain={[0, "dataMax + 5"]}
                          />
                          <YAxis dataKey="name" type="category" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="tiempo" fill="var(--color-tiempo)" name="Tu tiempo" />
                          <Bar dataKey="promedio" fill="var(--color-promedio)" name="Tiempo promedio" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg">Distribución normal</CardTitle>
                  <CardDescription>Distribución de tiempos de todos los participantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      distribution: {
                        label: "Distribución",
                        color: "#BFDBFE", // Light blue color
                      },
                    }}
                    className="h-[300px]"
                  >
                    <AreaChart 
                      data={bellCurveData} 
                      margin={{ top: 30, right: 20, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis
                        dataKey="x"
                        type="number"
                        domain={[minTime, maxTime]} // Use calculated domain
                        // Generate ticks dynamically based on the range
                        ticks={(() => {
                          const range = maxTime - minTime;
                          const tickCount = Math.min(10, Math.floor(range / 3));
                          const tickStep = range / tickCount;
                          return Array.from({ length: tickCount + 1 }, (_, i) => 
                            Math.round((minTime + i * tickStep) * 10) / 10
                          );
                        })()}
                        tickFormatter={(value) => `${value}`}
                        label={{ 
                          value: "Tiempo (min)", 
                          position: "insideBottom", 
                          offset: 0
                        }}
                      />
                      <YAxis hide />
                      <Area
                        type="monotone"
                        dataKey="y"
                        stroke="#93C5FD" // Blue stroke
                        fill="#BFDBFE" // Light blue fill
                        fillOpacity={0.6}
                        isAnimationActive={false} // Disable animation to ensure immediate rendering
                      />
                      {userData.termino === "Sí" && (
                        <ReferenceLine
                          x={userTimeMin}
                          stroke="#FF0000"
                          strokeWidth={2}
                          label={{
                            value: "Tu tiempo",
                            position: "top",
                            fill: "#FF0000",
                            fontSize: 12,
                          }}
                          ifOverflow="extendDomain" // Ensure the line is visible even if it's at domain edges
                        />
                      )}
                      <ReferenceLine
                        x={mean}
                        stroke="#6B7280" // Gray
                        strokeDasharray="3 3"
                        ifOverflow="extendDomain"
                        label={{
                          value: "Promedio",
                          position: "top",
                          fill: "#6B7280",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded p-2 shadow-md">
                                <p className="font-medium">
                                  Tiempo: {data.x.toFixed(0)} min
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {data.x < mean ? "Mejor que el promedio" : "Peor que el promedio"}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </AreaChart>
                  </ChartContainer>

                  <Alert className="mt-4">
                    <AlertTitle className="flex items-center gap-2">
                      <BarChartIcon className="h-4 w-4" />
                      Cómo interpretar esta gráfica
                    </AlertTitle>
                    <AlertDescription>
                      <p className="text-sm mb-2">
                        Esta curva muestra la distribución de todos los tiempos. La línea roja marca tu tiempo de{" "}
                        {userTimeMin.toFixed(1)} minutos.
                      </p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        <li>
                          Cuanto más a la <strong>izquierda</strong> esté tu línea, <strong>mejor</strong> es tu
                          rendimiento (menos tiempo).
                        </li>
                        <li>
                          La mayoría de los participantes se concentran en el centro de la curva (alrededor de{" "}
                          {mean.toFixed(0)} minutos).
                        </li>
                        <li>
                          La <strong>variación típica</strong> (o desviación estándar) de {stdDev.toFixed(1)} minutos
                          indica cuánto varían los tiempos respecto al promedio.
                        </li>
                        <li>
                          Tu <strong>Z-score</strong> de {zScore.toFixed(2)} indica cuántas variaciones típicas estás
                          por encima o por debajo del promedio.
                        </li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

