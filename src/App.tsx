import '@fontsource-variable/inter'
import './styles/index.css'
import './styles/interface.scss'
import Lyrics from './components/Lyrics.tsx'
import Settings, { defaultConfig, defaultObsConfig, LyrutlConfig } from './components/Settings.tsx'
import { parseUpdateInfo, updateInfo } from './libs/updateInfo.ts'
import { createEffect, createSignal, onMount } from 'solid-js'
import {
  applyTheme,
  argbFromHex,
  themeFromImage,
  themeFromSourceColor,
} from '@material/material-color-utilities'
import { createStore } from 'solid-js/store'
import { useConfig } from './libs/utils.ts'
import DynaGradient from './components/DynaGradient.tsx'
import LyrutlServer from './libs/server.ts'

function App() {
  const config = createStore<LyrutlConfig>(defaultConfig)
  const [theme, setTheme] = createSignal(themeFromSourceColor(argbFromHex('#00ff88')))
  const [drawer, setDrawer] = createSignal(true)

  const [timeSync, setTimeSync] = createSignal(0)
  const [paused, setPaused] = createSignal(true)

  const server = new LyrutlServer()
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
        onConnectServer={(url) =>
          server.useWsTest(url, (data) => {
            const res = parseUpdateInfo(data)
            switch (res[0]) {
              case updateInfo.time:
                console.log('sync')
                setPaused(false)
                setTimeSync(Number(res[1]) * 1000)
                break
              case updateInfo.paused:
                console.log('pause')
                setPaused(true)
                break
            }
          })
        }
      />
      <Lyrics
        config={config[0]}
        onCoverUpdate={(img) => themeFromImage(img).then((t) => setTheme(t))}
        timeSync={timeSync()}
        paused={paused()}
      />
      {config[0].dynamic && (
        <DynaGradient
          theme={theme()}
          dark={
            config[0].darkTheme == 'auto'
              ? window.matchMedia('(prefers-color-scheme: dark)').matches
              : config[0].darkTheme
          }
        />
      )}
    </>
  )
}

export default App
