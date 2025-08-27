"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedEventEmitter = void 0;
const events_1 = require("events");
class TypedEventEmitter {
    constructor() {
        this.emitter = new events_1.EventEmitter();
    }
    on(event, listener) {
        this.emitter.on(event, listener);
    }
    emit(event, data) {
        this.emitter.emit(event, data);
    }
}
exports.TypedEventEmitter = TypedEventEmitter;
