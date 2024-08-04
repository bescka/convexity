export class EventManager {
  constructor() {
    this.eventListeners = [];
  }

  addEventListener(canvas, eventType, handler) {
    const rect = canvas.getBoundingClientRect();

    // Wrapping the handler - includes the rect parameter
    const wrappedHandler = (event) => handler(event, rect);
    canvas.addEventListener(eventType, wrappedHandler);
    this.eventListeners.push({ canvas, eventType, handler: wrappedHandler });
  }

  removeEventListeners() {
    this.eventListeners.forEach(({ canvas, eventType, handler }) => {
      canvas.removeEventListener(eventType, handler);
    });
    this.eventListeners = [];
  }
}
