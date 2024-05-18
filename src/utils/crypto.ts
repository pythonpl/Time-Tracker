import { createHash, randomBytes } from "node:crypto";

export function hashString(payload: string) {  
    return createHash('sha256').update(payload).digest('hex');
}

export function randomString(bytes: number = 24) {
    return randomBytes(bytes).toString('hex');
}