import { LyricLine } from 'clrc'
import { LyrutlConfig } from '../components/Settings.tsx'

export function pxToRem(px: number): number {
  return px / Number(window.getComputedStyle(document.documentElement).fontSize.slice(0, -2))
}

export function blobToBase64(src: string, type = 'image/jpeg'): any {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    img.crossOrigin = '*'
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, img.width, img.height)
      resolve(canvas.toDataURL(type))
    }
    img.onerror = () => reject(new Error('blobToBase64: image error'))
    img.src = src
  })
}

export function useConfig(config: LyrutlConfig) {
  config.transparent
    ? document.documentElement.classList.add('transparent')
    : document.documentElement.classList.remove('transparent')
  config.scale
    ? document.documentElement.classList.add('scale')
    : document.documentElement.classList.remove('scale')
}

export function findIndex(lrc: LyricLine[], ms: number) {
  for (let j = 0; j < lrc.length; j++) {
    if (ms <= lrc[j].startMillisecond) return j
  }
  return lrc.length
}

export function limitNumber(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max)
}

export function rangedRand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function listRand<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)]
}
