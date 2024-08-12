// everything millisecond
export default class Timer {
  time: number
  interval: number
  callback: (t: typeof this.time) => void
  private id: number | undefined
  constructor(int: number = 100, fn: typeof this.callback) {
    this.time = 0
    this.interval = int
    this.callback = fn
  }
  start(at: number = -1) {
    this.stop(at)
    this.id = setInterval(() => {
      this.callback(this.time)
      this.time += this.interval
    }, this.interval)
  }
  stop(at: number = -1) {
    clearInterval(this.id)
    if (at >= 0) this.time = at + this.interval
  }
}
