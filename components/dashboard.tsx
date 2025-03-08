"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import UserPerformance from "@/components/user-performance"
import CoachAnalytics from "@/components/coach-analytics"
import UserSelector from "@/components/user-selector"
import DateSelector from "@/components/date-selector"

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [activeTab, setActiveTab] = useState("coach")
  const [selectedDate, setSelectedDate] = useState("Jueves, 6 de marzo de 2025")

  // Switch to participant tab when a user is selected
  useEffect(() => {
    if (selectedUser) {
      setActiveTab("user")
    }
  }, [selectedUser])

  return (
    <div className="container px-4 py-6 mx-auto space-y-6 md:py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Hyrox Performance Dashboard</h1>
        <p className="text-muted-foreground mt-2">Análisis de rendimiento de las sesiones Hyrox</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Selecciona la fecha, clase y participante para ver estadísticas detalladas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          <UserSelector
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
          />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">Participante</TabsTrigger>
          <TabsTrigger value="coach">Coach</TabsTrigger>
        </TabsList>
        <TabsContent value="user" className="space-y-4">
          <UserPerformance selectedUser={selectedUser} />
        </TabsContent>
        <TabsContent value="coach" className="space-y-4">
          <CoachAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

