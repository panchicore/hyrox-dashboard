# Hyrox Dataset Specification

## Overview
This dataset contains performance results from Hyrox training sessions organized by date. Each date includes multiple participants across different class times, with detailed metrics on completion times, rankings, and relative performance.

## Data Structure
The dataset is structured as a JavaScript object with ISO dates as keys (YYYY-MM-DD), each containing participant data:

```javascript
{
  "2025-03-06": {
    fecha: "2025-03-06",
    nombre_display: "Thursday, March 6, 2025",
    participantes: [
      // Array of participant objects
    ]
  },
  // More dates...
}
```

### Date Object Properties

| Property | Type | Description |
|----------|------|-------------|
| fecha | string | Date in ISO format (YYYY-MM-DD) |
| nombre_display | string | Human-readable date format for UI display |
| participantes | array | Array of participant objects for this date |

### Participant Object Properties

| Property | Type | Description |
|----------|------|-------------|
| clase | string | Class time (5AM, 6AM, etc.) |
| nombre | string | Participant name, sometimes with class identifier for disambiguation |
| tiempo | string | Total time in "MM:SS" format for those who completed, empty string for those who didn't |
| tiempo_segs | number/null | Time converted to seconds, null for those who didn't complete |
| termino | string | Completion indicator ("Sí"/"No") |
| ultimo_workout | string | Final station reached ("20cal" for those who completed, other values for those who didn't) |
| genero | string | Participant gender category ("F"/"M") |
| ranking_general | number/null | Overall position among all participants who completed, null for those who didn't |
| ranking_por_sexo | string/null | Position within gender category (e.g., "F1", "M3"), null for those who didn't complete |
| delta_vs_1_min | number/null | Time difference in minutes from first place, null for those who didn't complete |
| delta_vs_anterior_min | number/null | Time difference in minutes from the participant with the immediately higher ranking, null for those who didn't complete |

## Specific Values
- **termino**: "Sí" (Yes) or "No" (No)
- **ultimo_workout**: "20cal" (completed), or values like "8cal", "12cal", "30mbs", "200m", etc. (not completed)
- **ranking_por_sexo**: Prefix "F" or "M" based on gender + sequential number

## Processing Handwritten Boards
When processing an image of a handwritten board with Hyrox results:

1. **Initial Extraction**:
   - Identify each class time (5AM, 6AM, etc.)
   - For each participant, extract name and time
   - Determine completion status based on whether they have a full time or only partial progress
   - Infer gender ("F"/"M") based on participant's name

2. **Derived Calculations (at extraction time)**:
   - Convert times to seconds (MM:SS → total seconds) for `tiempo_segs`
   - Determine `termino` status ("Sí"/"No") based on whether time format matches MM:SS
   - Identify `ultimo_workout`: if the result doesn't follow MM:SS format, it's considered incomplete and this value represents the last workout station reached
   - Sort by ascending time to assign rankings
   - Calculate all deltas between positions

3. **Naming Conventions**:
   - When duplicate names exist, add the class time as a suffix (e.g., "Jose 5AM")
   - If multiple duplicates exist in the same class, add numbering (e.g., "Jose 6AM-1", "Jose 6AM-2")

4. **Default Values**:
   - For participants who didn't complete: empty time string, tiempo_segs=null, rankings=null, deltas=null
   - Last workout: "20cal" for those who completed, actual progress value for those who didn't

## Usage in Applications
This dataset structure is designed for easy integration with date selector UI components:

```javascript
// In your React component
const [selectedDate, setSelectedDate] = useState("2025-03-06");
const [workoutData, setWorkoutData] = useState([]);

useEffect(() => {
  // Update data when selected date changes
  setWorkoutData(hyroxDataByDate[selectedDate]?.participantes || []);
}, [selectedDate]);

// Generate date dropdown options
const dateOptions = Object.values(hyroxDataByDate).map(dateData => ({
  value: dateData.fecha,
  label: dateData.nombre_display
}));
```

## Data Analysis Capabilities
The structure enables:
- Comparison of performance across different dates
- Tracking individual progress over time
- Identification of trends in class performance
- Analysis of completion rates by gender, class time, and date
- Visualization of performance gaps and improvements

## Validation
A JSON Schema is available to validate the dataset structure and ensure consistency when adding new dates or participants.

# Data schema

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "HyroxDataByDate",
  "description": "Datos de entrenamiento Hyrox organizados por fechas",
  "type": "object",
  "patternProperties": {
    "^[0-9]{4}-[0-9]{2}-[0-9]{2}$": {
      "type": "object",
      "required": ["fecha", "nombre_display", "participantes"],
      "properties": {
        "fecha": {
          "type": "string",
          "description": "Fecha en formato ISO YYYY-MM-DD",
          "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
        },
        "nombre_display": {
          "type": "string",
          "description": "Nombre amigable para mostrar en la UI",
          "example": "Jueves 6 de Marzo 2025"
        },
        "participantes": {
          "type": "array",
          "description": "Lista de participantes en las sesiones Hyrox de esta fecha",
          "items": {
            "type": "object",
            "required": ["clase", "nombre", "tiempo", "termino", "ultimo_workout", "genero"],
            "properties": {
              "clase": {
                "type": "string",
                "description": "Horario de la clase",
                "examples": ["5AM", "6AM", "4PM"]
              },
              "nombre": {
                "type": "string",
                "description": "Nombre del participante, posiblemente con designación de clase"
              },
              "tiempo": {
                "type": "string",
                "description": "Tiempo en formato MM:SS para quienes completaron, cadena vacía para quienes no"
              },
              "tiempo_segs": {
                "type": ["number", "null"],
                "description": "Tiempo convertido a segundos, null para quienes no completaron"
              },
              "termino": {
                "type": "string",
                "description": "Indicador de si completó el workout",
                "enum": ["Sí", "No"]
              },
              "ultimo_workout": {
                "type": "string",
                "description": "Último ejercicio completado (20cal para quienes terminaron, otro valor para quienes no)"
              },
              "genero": {
                "type": "string",
                "description": "Género del participante",
                "enum": ["F", "M"]
              },
              "ranking_general": {
                "type": ["integer", "null"],
                "description": "Posición en el ranking general, null para quienes no completaron"
              },
              "ranking_por_sexo": {
                "type": ["string", "null"],
                "description": "Posición en el ranking por sexo (ej: F1, M3), null para quienes no completaron"
              },
              "delta_vs_1_min": {
                "type": ["number", "null"],
                "description": "Diferencia de tiempo en minutos respecto al primer lugar, null para quienes no completaron"
              },
              "delta_vs_anterior_min": {
                "type": ["number", "null"],
                "description": "Diferencia de tiempo en minutos respecto al ranking anterior, null para quienes no completaron"
              }
            },
            "additionalProperties": false
          }
        }
      },
      "additionalProperties": true
    }
  },
  "additionalProperties": false
}
```