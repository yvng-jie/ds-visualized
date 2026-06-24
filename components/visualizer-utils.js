/**
 * visualizer-utils — Shared drawing utilities for Canvas-based Visualizers
 *
 * Provides consistent styling and drawing primitives across all components.
 */

const COLORS = {
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  secondary: '#6366f1',
  secondaryDark: '#4f46e5',
  accent: '#f59e0b',
  danger: '#ef4444',
  success: '#22c55e',
  successDark: '#16a34a',
  muted: '#94a3b8',
  text: '#64748b',
  white: '#ffffff',
  purple: '#8b5cf6',
  purpleDark: '#7c3aed',
}

/**
 * Create a rounded rectangle path on canvas (does not fill/stroke)
 */
export function createRoundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/**
 * Draw a filled rounded rectangle with gradient
 */
export function drawGradientBox(ctx, x, y, w, h, r, colorStart, colorEnd) {
  const gradient = ctx.createLinearGradient(x, y, x, y + h)
  gradient.addColorStop(0, colorStart)
  gradient.addColorStop(1, colorEnd)
  ctx.fillStyle = gradient
  createRoundedRectPath(ctx, x, y, w, h, r)
  ctx.fill()
}

/**
 * Draw centered text
 */
export function drawText(ctx, text, x, y, color = COLORS.white, font = 'bold 14px monospace') {
  ctx.fillStyle = color
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(text), x, y)
}

/**
 * Draw an arrow between two points
 */
export function drawArrow(ctx, x1, y1, x2, y2, color = COLORS.muted, lineWidth = 2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.stroke()
}

/**
 * Draw a circle/vertex node
 */
export function drawNode(ctx, x, y, radius, label, color = COLORS.secondary, strokeColor = COLORS.secondaryDark) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = 2
  ctx.stroke()
  drawText(ctx, String(label), x, y)
}

/**
 * Draw index label below an element
 */
export function drawIndex(ctx, text, x, y, color = COLORS.muted) {
  ctx.fillStyle = color
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(String(text), x, y)
}

/**
 * Draw status text on canvas (centered, muted)
 */
export function drawEmptyMessage(ctx, message, canvasWidth, canvasHeight) {
  ctx.fillStyle = COLORS.muted
  ctx.font = '16px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(message, canvasWidth / 2, canvasHeight / 2)
}

export { COLORS }
