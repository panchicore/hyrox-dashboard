"use client"

import { Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateSelectorProps {
  selectedDate: string
  setSelectedDate: (date: string) => void
}

export default function DateSelector({ selectedDate, setSelectedDate }: DateSelectorProps) {
  // Solo tenemos una fecha disponible
  const availableDates = ["Jueves, 6 de marzo de 2025"]

  return (
    <div className="w-full">
      <label className="text-sm font-medium mb-1 block">Fecha</label>
      <Select value={selectedDate} onValueChange={setSelectedDate}>
        <SelectTrigger className="w-full">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Selecciona una fecha" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {availableDates.map((date) => (
            <SelectItem key={date} value={date}>
              {date}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

