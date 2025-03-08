// Funciones estadísticas básicas

// Función de densidad de probabilidad normal
export function normalPDF(x: number, mean: number, stdDev: number): number {
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2))
}

// Función de distribución acumulativa normal (aproximación)
export function normalCDF(x: number, mean: number, stdDev: number): number {
  // Usando la aproximación de la función error
  const z = (x - mean) / (stdDev * Math.sqrt(2))
  return 0.5 * (1 + erf(z))
}

// Aproximación de la función error (erf)
function erf(x: number): number {
  // Constantes para la aproximación
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  // Guardar el signo de x
  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)

  // Fórmula de aproximación
  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}

// Convertir z-score a percentil
export function zScoreToPercentile(zScore: number): number {
  return normalCDF(zScore, 0, 1) * 100
}

// Calcular tiempo en minutos a partir de segundos
export function segsToMinutos(segs: number): number {
  return segs / 60
}

