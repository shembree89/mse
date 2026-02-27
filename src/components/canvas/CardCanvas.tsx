import { useRef, useState, useEffect, useCallback } from 'react'
import { Stage, Layer } from 'react-konva'
import { CardRenderer } from './CardRenderer.tsx'
import { CARD_WIDTH, CARD_HEIGHT } from '../../engine/cardLayout.ts'

export function CardCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      })
    }
  }, [])

  useEffect(() => {
    updateDimensions()
    const observer = new ResizeObserver(updateDimensions)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [updateDimensions])

  const scale = Math.min(
    (dimensions.width - 40) / CARD_WIDTH,
    (dimensions.height - 40) / CARD_HEIGHT,
    1,
  )

  const offsetX = (dimensions.width - CARD_WIDTH * scale) / 2
  const offsetY = (dimensions.height - CARD_HEIGHT * scale) / 2

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center bg-surface-0">
      {dimensions.width > 0 && (
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          scaleX={scale}
          scaleY={scale}
          x={offsetX}
          y={offsetY}
        >
          <Layer>
            <CardRenderer width={CARD_WIDTH} height={CARD_HEIGHT} />
          </Layer>
        </Stage>
      )}
    </div>
  )
}
