declare module 'http' {
  interface IncomingMessage {
    requestId: string;
    startTime: number;
  }
}
