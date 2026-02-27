import { loadFrameImage, loadMaskImage } from './frameImageLoader.ts'

/**
 * Dual-color frame compositing using real Card Conjurer mask PNGs.
 *
 * How it works (matching Card Conjurer's approach):
 * 1. Draw the left color frame at full size
 * 2. Draw the right color frame masked by maskRightHalf.png
 * 3. Overlay multicolor pinlines using m15MaskPinline.png
 *
 * The mask PNGs are 2010x2814 RGBA — white = visible, black/transparent = hidden.
 */

const compositeCache = new Map<string, HTMLCanvasElement>()

/**
 * Composite two mono-color frames into a dual-color frame.
 * Returns a canvas that can be drawn to Konva or exported.
 */
export async function compositeDualFrame(
  leftKey: string,
  rightKey: string,
): Promise<HTMLCanvasElement> {
  const cacheKey = `${leftKey}+${rightKey}`
  const cached = compositeCache.get(cacheKey)
  if (cached) return cached

  // Load all assets in parallel
  const [leftFrame, rightFrame, rightMask] = await Promise.all([
    loadFrameImage(leftKey),
    loadFrameImage(rightKey),
    loadMaskImage('maskRightHalf.png'),
  ])

  const w = leftFrame.naturalWidth
  const h = leftFrame.naturalHeight

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  // 1. Draw the left frame (full)
  ctx.drawImage(leftFrame, 0, 0, w, h)

  // 2. Create masked right frame
  const temp = document.createElement('canvas')
  temp.width = w
  temp.height = h
  const tempCtx = temp.getContext('2d')!

  // Draw the mask first
  tempCtx.drawImage(rightMask, 0, 0, w, h)

  // Apply right frame only where mask is white
  tempCtx.globalCompositeOperation = 'source-in'
  tempCtx.drawImage(rightFrame, 0, 0, w, h)

  // 3. Overlay the masked right half onto the left frame
  ctx.drawImage(temp, 0, 0)

  // Try to load and overlay gold pinlines for the split
  try {
    const goldFrame = await loadFrameImage('gold')
    const pinlineMask = await loadMaskImage('m15MaskPinline.png')

    const pinTemp = document.createElement('canvas')
    pinTemp.width = w
    pinTemp.height = h
    const pinCtx = pinTemp.getContext('2d')!

    // Mask the gold frame through the pinline mask
    pinCtx.drawImage(pinlineMask, 0, 0, w, h)
    pinCtx.globalCompositeOperation = 'source-in'
    pinCtx.drawImage(goldFrame, 0, 0, w, h)

    // Overlay pinlines
    ctx.drawImage(pinTemp, 0, 0)
  } catch {
    // Pinline overlay is optional — degrade gracefully
  }

  compositeCache.set(cacheKey, canvas)
  return canvas
}
