"use client"
import { hyroxData } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserSelectorProps {
  selectedUser: string
  setSelectedUser: (value: string) => void
  selectedClass: string
  setSelectedClass: (value: string) => void
}

export default function UserSelector({
  selectedUser,
  setSelectedUser,
  selectedClass,
  setSelectedClass,
}: UserSelectorProps) {
  // Get unique class times
  const classes = ["Todas", ...Array.from(new Set(hyroxData.map((user) => user.clase)))].sort()

  // Filter users by selected class if a class is selected
  const filteredUsers =
    selectedClass && selectedClass !== "Todas" ? hyroxData.filter((user) => user.clase === selectedClass) : hyroxData

  // Create user display names with ranking
  const userOptions = filteredUsers.map((user) => {
    // For users who completed, add their ranking
    if (user.termino === "Sí") {
      return {
        nombre: user.nombre,
        displayName: `${user.nombre} (#${user.ranking_general})`,
        ranking: user.ranking_general,
      }
    } else {
      // For users who didn't complete
      return {
        nombre: user.nombre,
        displayName: `${user.nombre} (No completó)`,
        ranking: 999, // High number to sort at the end
      }
    }
  })

  // Sort users by ranking (completed first, then non-completed)
  const sortedUsers = userOptions.sort((a, b) => a.ranking - b.ranking)

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div className="w-full sm:w-1/2">
        <label className="text-sm font-medium mb-1 block">Clase</label>
        <Select
          value={selectedClass || "Todas"}
          onValueChange={(value) => {
            setSelectedClass(value === "Todas" ? "" : value)
            setSelectedUser("")
          }}
        >
          <SelectTrigger className="w-full">
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

      <div className="w-full sm:w-1/2">
        <label className="text-sm font-medium mb-1 block">Participante</label>
        <Select value={selectedUser} onValueChange={setSelectedUser} disabled={sortedUsers.length === 0}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={sortedUsers.length === 0 ? "No hay participantes" : "Selecciona un participante"}
            />
          </SelectTrigger>
          <SelectContent>
            {sortedUsers.map((user) => (
              <SelectItem key={user.nombre} value={user.nombre}>
                {user.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

