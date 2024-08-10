import { JSX } from 'solid-js'
import PathIcon from './PathIcon.tsx'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { SetStoreFunction } from 'solid-js/store'

export interface LyrutlConfig {
  local: boolean
  darkTheme: boolean | 'auto'
  transparent: boolean
  scale: boolean
  blur: boolean
  dynamic: boolean
}

export const defaultConfig: LyrutlConfig = {
  local: false,
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
}

export default function Settings(props: SettingsProps) {
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
        <h1 class="flex items-start justify-between self-stretch">
          <span>configure</span>
          <button class="icon-button" onClick={() => props.onToggle && props.onToggle(false)}>
            <PathIcon path={mdiChevronLeft} />
          </button>
        </h1>
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
        <div class="flex-grow min-h-5" />
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
