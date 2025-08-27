import { EventEmitter } from "events";

export class TypedEventEmitter<Events> {
  private emitter = new EventEmitter();

  on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void) {
    this.emitter.on(event as string, listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]) {
    this.emitter.emit(event as string, data);
  }
}
