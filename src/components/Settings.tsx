import { createSignal, JSX } from 'solid-js'
import PathIcon from './PathIcon.tsx'
import { mdiArrowRight, mdiChevronLeft, mdiChevronRight, mdiServer, mdiWrench } from '@mdi/js'
import { SetStoreFunction } from 'solid-js/store'

export interface LyrutlConfig {
  server: string
  darkTheme: boolean | 'auto'
  transparent: boolean
  scale: boolean
  blur: boolean
  dynamic: boolean
}

export const defaultConfig: LyrutlConfig = {
  server: 'localhost:6700',
  darkTheme: 'auto',
  transparent: false,
  scale: false,
  blur: true,
  dynamic: false,
}

export const defaultObsConfig: LyrutlConfig = {
  ...defaultConfig,
  darkTheme: true,
  transparent: true,
  scale: true,
}

interface SettingsProps {
  children?: JSX.Element
  config: [LyrutlConfig, SetStoreFunction<LyrutlConfig>]
  open: boolean
  canOpen?: boolean
  onToggle?: (open: boolean) => void
  onConnectServer: (url: string) => Promise<boolean>
}

export default function Settings(props: SettingsProps) {
  const [pageIndex, setPageIndex] = createSignal(0)
  const [connectStat, setConnectStat] = createSignal<'disconnected' | 'connecting' | 'connected'>(
    'disconnected',
  )
  let inputRef!: HTMLInputElement
  const pages: { icon: string; title: string; content: JSX.Element }[] = [
    {
      icon: mdiServer,
      title: 'connect',
      content: (
        <>
          <h2>connect to a server first to get started.</h2>
          <p class="tips">all operations are performed in your browser.</p>
          <div
            class="flex items-center self-stretch font-mono"
            data-disabled={connectStat() == 'connecting'}
          >
            <p class="text-xs">ws://</p>
            <input
              ref={inputRef}
              class="input flex-grow"
              type="text"
              value={props.config[0].server}
              placeholder="host:port"
            />
            <button
              class="icon-button"
              onClick={() => {
                props.config[1]('server', inputRef.value)
                setConnectStat('connecting')
                props
                  .onConnectServer('ws://' + props.config[0].server)
                  .then((c) => (c ? setConnectStat('connected') : setConnectStat('disconnected')))
              }}
            >
              <PathIcon path={mdiArrowRight} />
            </button>
          </div>
          <p class="tips">{connectStat()}</p>
        </>
      ),
    },
    {
      icon: mdiWrench,
      title: 'configure',
      content: (
        <>
          <h2>dark mode</h2>
          <div class="switches">
            <button
              class="switch"
              data-active={props.config[0].darkTheme == 'auto'}
              onClick={() => props.config[1]('darkTheme', 'auto')}
            >
              system
            </button>
            <button
              class="switch"
              data-active={props.config[0].darkTheme == true}
              onClick={() => props.config[1]('darkTheme', true)}
            >
              true
            </button>
            <button
              class="switch"
              data-active={props.config[0].darkTheme == false}
              onClick={() => props.config[1]('darkTheme', false)}
            >
              false
            </button>
          </div>
          <h2>transparent bg</h2>
          <div class="switches">
            <button
              class="switch"
              data-active={props.config[0].transparent}
              onClick={() => props.config[1]('transparent', true)}
            >
              true
            </button>
            <button
              class="switch"
              data-active={!props.config[0].transparent}
              onClick={() => props.config[1]('transparent', false)}
            >
              false
            </button>
          </div>
          <h2>scaling</h2>
          <p class="tips">responsive scaling based on viewport width</p>
          <div class="switches">
            <button
              class="switch"
              data-active={props.config[0].scale}
              onClick={() => props.config[1]('scale', true)}
            >
              responsive
            </button>
            <button
              class="switch"
              data-active={!props.config[0].scale}
              onClick={() => props.config[1]('scale', false)}
            >
              default
            </button>
          </div>
          <h2>blur</h2>
          <p class="tips">disable for better performance</p>
          <div class="switches">
            <button
              class="switch"
              data-active={props.config[0].blur}
              onClick={() => props.config[1]('blur', true)}
            >
              true
            </button>
            <button
              class="switch"
              data-active={!props.config[0].blur}
              onClick={() => props.config[1]('blur', false)}
            >
              false
            </button>
          </div>
          <h2>dynamic background</h2>
          <p class="tips">same as above</p>
          <div class="switches">
            <button
              class="switch"
              data-active={props.config[0].dynamic}
              onClick={() => props.config[1]('dynamic', true)}
            >
              true
            </button>
            <button
              class="switch"
              data-active={!props.config[0].dynamic}
              onClick={() => props.config[1]('dynamic', false)}
            >
              false
            </button>
          </div>
        </>
      ),
    },
  ]
  return (
    <>
      {props.canOpen && !props.open && (
        <button
          class="icon-button drawer-open"
          onClick={() => props.onToggle && props.onToggle(true)}
        >
          <PathIcon path={mdiChevronRight} />
        </button>
      )}
      <div
        class="drawer"
        style={{
          transform: `${props.open ? 'none' : 'translateX(-25%)'}`,
          opacity: `${props.open ? '1' : '0'}`,
          'pointer-events': `${props.open ? 'auto' : 'none'}`,
        }}
      >
        <div class="flex items-start self-stretch">
          <div class="tabs flex-grow">
            {pages.map((value, index) => (
              <div
                class="tab"
                data-active={index == pageIndex()}
                onClick={() => setPageIndex(index)}
              >
                <PathIcon path={value.icon} class="mr-1" />
                {value.title}
              </div>
            ))}
          </div>
          <button class="icon-button" onClick={() => props.onToggle && props.onToggle(false)}>
            <PathIcon path={mdiChevronLeft} />
          </button>
        </div>
        {pages[pageIndex()].content}
        <div class="flex-grow min-h-6" />
        {window.obsstudio && <p class="tips">obs detected</p>}
        <p class="tips">
          <a
            class="underline"
            href="https://github.com/fishyua/lyrutl-client/"
            target="_blank"
            rel="noreferrer"
          >
            lyrutl-client
          </a>
        </p>
      </div>
    </>
  )
}
