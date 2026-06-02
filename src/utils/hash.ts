import crypto from 'crypto';

export function generateUUID(): string {
    return crypto.randomUUID();
}

export function generateDedupHash(email: string, phone: string, message: string): string {
    return crypto
        .createHash('sha256')
        .update(`${email.toLowerCase()}:${phone}:${message}`)
        .digest('hex');
}

export function generateHMAC(secret: string, payload: string): string {
    return crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
}

export function timingSafeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}