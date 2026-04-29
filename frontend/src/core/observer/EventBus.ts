type EventCallback = (data: any) => void;

class EventBus {
  private observers: Record<string, EventCallback[]> = {};

  subscribe(topic: string, callback: EventCallback) {
    if (!this.observers[topic]) {
      this.observers[topic] = [];
    }
    this.observers[topic].push(callback);

    // Return unsubscribe function
    return () => {
      this.observers[topic] = this.observers[topic].filter((cb) => cb !== callback);
    };
  }

  publish(topic: string, data: any) {
    if (this.observers[topic]) {
      this.observers[topic].forEach((cb) => cb(data));
    }
  }
}

export const eventBus = new EventBus();
