import { createEffect, createSignal, JSX, onCleanup } from 'solid-js'
import { LyricLine, parse } from 'clrc'
import gsap from 'gsap'
import { limitNumber, pxToRem } from '../libs/utils.ts'
import { LyrutlConfig } from './Settings.tsx'
import {
  lrcAnimDelay,
  lrcAnimTarget,
  lrcEasingDur,
  lrcEasingOffset,
  lrcGap,
  lrcTween,
} from '../libs/constants.ts'
import Timer from '../libs/timer.ts'

const testLrc =
  '[00:12.838] You carried me, bettered me\n[00:14.533] Figured me out\n[00:18.957] Got nothing else\n[00:19.816] Nothing to write home about, yeah\n[00:25.047] I’m coming back to safety\n[00:26.763] Told you I would\n[00:31.288] Keep running after this\n[00:32.485] This ought to be good\n[00:34.527]\n[00:35.562] We’re gonna be good\n[00:38.747] I’m gonna make a world like no one else\n[00:41.807] And it’s gonna be yours\n[00:45.047] And nobody can take it\n[00:46.766] Nobody can take it\n[00:48.328] Back from you (Oh)\n[00:53.989] And it’s gonna be good, yeah\n[00:58.939]\n[01:02.066] And people stare, people think\n[01:03.797] People know best\n[01:08.129] We’re making noise, making love\n[01:09.832] Making a mess\n[01:13.301] And I know that we tried and we gave it all we could (Aha-ha)\n[01:20.548] Keep running after this\n[01:21.712] This ought to be good\n[01:23.841]\n[01:24.860] We’re gonna be good\n[01:28.172] I’m gonna make a world to ourselves just ourselves\n[01:30.984] And it’s gonna be yours\n[01:34.292] And nobody can take it\n[01:35.971] Nobody can take it\n[01:37.567] Back from you\n[01:39.588] It’s been harder than it should\n[01:43.266] But it’s gonna be good, yeah\n[01:47.653]\n[02:13.981] We’re gonna be\n[02:26.667] And nobody can take it\n[02:28.300] Nobody can take it\n[02:29.865] Nobody can take it\n[02:31.355] Nobody can take it\n[02:32.879] Back from you\n[02:38.713] We’re gonna be good\n'

interface LyricProps extends JSX.HTMLAttributes<HTMLDivElement> {
  config: LyrutlConfig
  onCoverUpdate?: (img: HTMLImageElement) => void
  timeSync: number
  paused: boolean
}

export default function Lyrics(props: LyricProps) {
  const [index, setIndex] = createSignal(-1)
  const timer = new Timer(25, (t) => {
    if (lrc[index() + 1].startMillisecond <= t + lrcAnimDelay + lrcEasingDur * lrcEasingOffset)
      setIndex((i) => i + 1)
  })

  let coverRef!: HTMLDivElement
  let lrcRef!: HTMLDivElement
  let lrc = parse(testLrc) as LyricLine[]

  // time
  createEffect(() => {
    if (props.paused) {
      timer.stop()
      return
    }
    timer.start(props.timeSync)
  })

  // update: lyrics
  createEffect(() => {
    if (!testLrc) return
    console.log('lyrics: updated, reset styles')
    gsap.set('#lyrics>div', { opacity: 0.4 })
    setIndex(-1)
  })

  // update: config
  createEffect(() => {
    if (!props.config.blur) gsap.set(lrcAnimTarget, { filter: 'none' })
  })

  // update: index
  createEffect(() => {
    if (!testLrc) return
    if (index() >= (parse(testLrc) as LyricLine[]).length) return
    console.log('lyrics: index', index())

    gsap.to(lrcAnimTarget, {
      ...lrcTween,
      ...(index() > -1 && {
        translateY: (_, __, targets: HTMLDivElement[]) => {
          let prev = 0
          for (let n = 0; n < index(); n++) prev += pxToRem(targets[n].clientHeight)
          return (
            -lrcGap * (index() + 1) -
            prev -
            (index() <= targets.length ? pxToRem(targets[index()].clientHeight / 2) : 0) +
            'rem'
          )
        },
      }),
      scale: (i) => (i == index() ? 1.03 : 1),
      delay: (i) => (i < index() - 1 ? 0 : lrcAnimDelay * (i - index() + 1)),
      transformOrigin: 'left center',
      opacity: (i) => {
        if (i < index()) return 0
        if (i > index()) return 0.3
        return 1
      },
      filter: (i) =>
        `blur(${i == index() || !props.config.blur ? 0 : limitNumber(Math.abs((i - index()) * 0.08), 0, 1)}rem)`,
    })
  })

  onCleanup(() => {
    timer.stop()
  })

  return (
    <div {...props} class={`w-full h-screen grid grid-cols-2 ${props.class}`}>
      <div ref={coverRef} class="flex flex-col items-end justify-center pr-[6.5vw]">
        <img
          id="testImg"
          src="/test.jpg"
          alt="album cover"
          class="w-[66%] aspect-square rounded-md min-w-6 min-h-6"
          onLoad={(e) => {
            console.log('lyrics: cover updated')
            props.onCoverUpdate && props.onCoverUpdate(e.target as HTMLImageElement)
          }}
        ></img>
      </div>
      <div
        id="lyrics-container"
        class="pl-[1vw] pr-32 h-full overflow-y-hidden"
        style={{ 'mask-image': 'linear-gradient(180deg,#fff 80%,TRANSPARENT 100%)' }}
        ref={lrcRef}
      >
        <div
          id="lyrics"
          style={{ gap: lrcGap + 'rem', 'padding-top': lrcGap + 'rem' }}
          class="text-3xl flex flex-col font-bold text-wrap leading-none tracking-tight translate-y-[40vh]"
        >
          {(parse(testLrc) as LyricLine[]).map((value) => (
            <div>{value.content}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
