"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareManager = void 0;
class MiddlewareManager {
    constructor() {
        this.middlewares = [];
    }
    use(mw) {
        this.middlewares.push(mw);
    }
    async run(ctx, msg, command, args, fn) {
        let i = -1;
        const runner = async (index) => {
            if (index <= i)
                throw new Error("next() Chamado Múltiplas Vezes");
            i = index;
            const mw = this.middlewares[index];
            if (mw) {
                await mw({ ctx, msg, command, args, next: () => runner(index + 1) });
            }
            else {
                await fn();
            }
        };
        await runner(0);
    }
}
exports.MiddlewareManager = MiddlewareManager;
