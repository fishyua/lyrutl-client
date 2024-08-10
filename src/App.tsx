import '@fontsource-variable/inter'
import './styles/index.css'
import './styles/interface.scss'
import Lyrics from './components/Lyrics.tsx'
import Settings, { defaultConfig, defaultObsConfig, LyrutlConfig } from './components/Settings.tsx'
import { createEffect, createSignal, onMount } from 'solid-js'
import {
  applyTheme,
  argbFromHex,
  themeFromImage,
  themeFromSourceColor,
} from '@material/material-color-utilities'
import { createStore } from 'solid-js/store'
import { useConfig } from './utils.ts'

function App() {
  const config = createStore<LyrutlConfig>(defaultConfig)
  const [theme, setTheme] = createSignal(themeFromSourceColor(argbFromHex('#00ff88')))
  const [drawer, setDrawer] = createSignal(true)
  createEffect(() => {
    useConfig(config[0])
    applyTheme(theme(), {
      target: document.documentElement,
      dark:
        config[0].darkTheme == 'auto'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
          : config[0].darkTheme,
    })
  })
  onMount(() => {
    window.obsstudio && config[1](defaultObsConfig)
  })
  return (
    <>
      <Settings
        config={config}
        canOpen={true}
        open={drawer()}
        onToggle={(open) => setDrawer(open)}
      />
      <Lyrics
        config={config[0]}
        onCoverUpdate={(img) => themeFromImage(img).then((t) => setTheme(t))}
      />
    </>
  )
}

export default App
