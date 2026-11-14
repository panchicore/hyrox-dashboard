"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserSelectorProps {
  selectedUser: string
  setSelectedUser: (value: string) => void
  selectedClass: string
  setSelectedClass: (value: string) => void
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

export default function UserSelector({ 
  selectedUser, 
  setSelectedUser, 
  selectedClass, 
  setSelectedClass,
  participants 
}: UserSelectorProps) {
  // Get unique class times
  const classes = ["Todas", ...new Set(participants.map((user) => user.clase))].sort()

  // Filter users by selected class
  const filteredUsers = selectedClass && selectedClass !== "Todas"
    ? participants.filter((user) => user.clase === selectedClass)
    : participants

  // Get all user names
  const users = filteredUsers.map((user) => user.nombre).sort()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm font-medium mb-1 block">Clase</label>
        <Select value={selectedClass} onValueChange={(value) => {
          setSelectedClass(value)
          setSelectedUser("") // Reset user when class changes
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una clase" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((classTime) => (
              <SelectItem key={classTime} value={classTime}>
                {classTime}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Participante</label>
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un participante" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user} value={user}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

