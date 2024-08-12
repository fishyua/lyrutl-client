import { updInfoSeparator } from './constants'

export enum updateInfo {
  time = 0,
  paused = 1,
}

export function parseUpdateInfo(data: string) {
  let tmp = data.split(updInfoSeparator) as (string | updateInfo)[]
  tmp[0] = Number(tmp[0]) as updateInfo
  return tmp
}
