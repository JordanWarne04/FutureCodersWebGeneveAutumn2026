import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

const secret = () => {
    if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 12) {
        throw new Error('ADMIN_PASSWORD doit contenir au moins 12 caractères');
    }
    return env.ADMIN_PASSWORD;
};

const digest = (value) =>
    createHmac('sha256', secret()).update(value).digest('hex');

export function isAdmin(cookies) {
    const token = cookies.get('admin_session') || '';
    const expected = digest('futurecoders-admin-v1');

    return (
        token.length === expected.length &&
        timingSafeEqual(Buffer.from(token), Buffer.from(expected))
    );
}

export function login(cookies, password) {
    const expected = Buffer.from(secret(), 'utf8');
    const actual = Buffer.from(password, 'utf8');

    if (
        actual.length !== expected.length ||
        !timingSafeEqual(actual, expected)
    ) {
        return false;
    }

    cookies.set('admin_session', digest('futurecoders-admin-v1'), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8
    });

    return true;
}