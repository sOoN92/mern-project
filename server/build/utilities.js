"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processMessage(payload) {
    try {
        return JSON.parse(payload);
    }
    catch (error) {
        return null;
    }
}
exports.processMessage = processMessage;
exports.JWT_SECRET_TOKEN = 'fsdjfnjògjdfgjdfò^^????1gkjòkldfgjò$%&1231233___!!!dfkjgkldfjgklògjdklfg';
