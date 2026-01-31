async function waitWS(): Promise<WebSocket> {
  return new Promise((resolve) => {
    const WS = window.WebSocket;

    window.WebSocket = (function (
      url: string | URL,
      protocols?: string | string[]
    ): WebSocket {
      const ws = protocols
        ? new WS(url, protocols)
        : new WS(url);

      window.WebSocket = WS;
      window.WebSocket.prototype = WS.prototype;

      resolve(ws);

      return ws;
    } as unknown) as typeof WebSocket;

    window.WebSocket.prototype = WS.prototype;
  });
}

export { waitWS };