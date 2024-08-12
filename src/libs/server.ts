export default class LyrutlServer {
  ws: WebSocket | null
  constructor() {
    this.ws = null
  }
  useWsTest(url: string, onData: (data: string) => void, timeout: number = 3000): Promise<boolean> {
    this.cleanupWS()
    return new Promise((resolve) => {
      try {
        this.ws = new WebSocket(url)
        this.ws.onmessage = (e) => onData(e.data)
        this.ws.onclose = () => {}
        this.ws.onopen = () => {
          resolve(true)
        }
        this.ws.onerror = () => {
          resolve(false)
        }
        setTimeout(() => {
          resolve(false)
        }, timeout)
      } catch {
        resolve(false)
      }
    })
  }
  cleanupWS() {
    if (!this.ws) return
    this.ws.close()
    this.ws = null
  }
}
