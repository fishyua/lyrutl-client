import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { listRand, rangedRand } from '../libs/utils'
import { hexFromArgb, Theme } from '@material/material-color-utilities'

class GradElement {
  size: number
  x: number
  y: number
  fill: string
  velocity: number
  constructor(size: number, x: number, y: number, fill: string, veloity: number) {
    this.size = size
    this.x = x
    this.y = y
    this.fill = fill
    this.velocity = veloity
  }
  render(ctx: CanvasRenderingContext2D): boolean {
    if (this.x - size / 2 >= window.innerWidth) return false
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2)
    ctx.fillStyle = this.fill
    ctx.fill()
    this.x += this.velocity
    return true
  }
}

const size = 360

interface DynaGradientProps {
  theme: Theme
  dark: boolean
}

export default function DynaGradient(props: DynaGradientProps) {
  const canvas = (<canvas width={640} height={480} />) as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!

  let t = 0
  let canRender = false
  let elements: GradElement[] = []

  const colorSelection: (keyof Theme['schemes']['light' | 'dark'])[] = [
    'secondary',
    'secondaryContainer',
    'surface',
    'surfaceVariant',
  ]
  const [colors, setColors] = createSignal<string[]>([])

  const preRender = () => {
    canRender = false
    t = 0
    elements = []
    for (let i = 0; i < 42; i++)
      elements.push(
        new GradElement(
          size,
          rangedRand(0, canvas.width),
          rangedRand(0, canvas.height),
          listRand(colors()),
          rangedRand(0.2, 0.6),
        ),
      )
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    canRender = true
  }

  createEffect(() => {
    setColors([])
    colorSelection.forEach((e) => {
      setColors((c) => [
        ...c,
        hexFromArgb(props.theme.schemes[props.dark ? 'dark' : 'light'][e] as number),
      ])
    })
    preRender()
  })

  const render: FrameRequestCallback = () => {
    if (!canRender) return
    if (t % 32 == 0)
      elements.push(
        new GradElement(
          size,
          -size / 2,
          rangedRand(0, canvas.height),
          listRand(colors()),
          rangedRand(0.3, 0.6),
        ),
      )
    for (let i = 0; i < elements.length; i++) {
      if (!elements[i].render(ctx)) {
        elements.splice(i, 1)
        i -= 1
      }
    }
    t += 1
    requestAnimationFrame(render)
  }

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  onMount(() => {
    resize()
    window.onresize = resize
    preRender()
    requestAnimationFrame(render)
  })

  onCleanup(() => {
    canRender = false
  })

  return canvas
}
