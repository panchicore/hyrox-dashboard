"use client"

import { Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { hyroxDataByDate } from "@/lib/data"

interface DateSelectorProps {
  selectedDate: string
  setSelectedDate: (date: string) => void
}

export default function DateSelector({ selectedDate, setSelectedDate }: DateSelectorProps) {
  // Get available dates from the hyroxDataByDate object
  const availableDates = Object.values(hyroxDataByDate).map(dateData => ({
    value: dateData.fecha,
    label: dateData.nombre_display
  }))

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
            <SelectItem key={date.value} value={date.value}>
              {date.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

