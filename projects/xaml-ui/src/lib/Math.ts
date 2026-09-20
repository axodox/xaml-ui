export function AreNearEqual(a: number, b: number, tolerance: number): boolean {
  return Math.abs(a - b) < tolerance;
}
