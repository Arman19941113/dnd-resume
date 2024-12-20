import type { MotionValue } from 'motion/react'
import { animate, useMotionValue } from 'motion/react'
import { useEffect } from 'react'

const inactiveShadow = '0px 0px 0px 2px rgba(0,0,0,0.8)'
const activeShadow = '0px 4px 12px 2px rgba(0,0,0,0.4)'
const inactiveScale = 1
const activeScale = 1.02
const duration = 0.2

export function useRaisedStyle(value: MotionValue<number>) {
  const scale = useMotionValue(inactiveScale)
  const boxShadow = useMotionValue(inactiveShadow)

  useEffect(() => {
    let isActive = false

    return value.on('change', latest => {
      const wasActive = isActive
      if (latest !== 0) {
        isActive = true
        if (isActive !== wasActive) {
          animate(scale, activeScale, { duration })
          animate(boxShadow, activeShadow, { duration })
        }
      } else {
        isActive = false
        if (isActive !== wasActive) {
          animate(scale, inactiveScale, { duration })
          animate(boxShadow, inactiveShadow, { duration })
        }
      }
    })
  }, [value, scale, boxShadow])

  return { scale, boxShadow }
}
