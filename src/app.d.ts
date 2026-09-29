export {}

declare global {
  interface Window {
    InjectApi: {
      startSocket: (msg: string, fn: string) => any
      stopSocket: () => any
    }
  }
}
