
import { error } from '@sveltejs/kit';
import { get, file } from '$lib/server/projects';
import { isAdmin } from '$lib/server/auth';

const types = {
    html: 'text/html; charset=utf-8',
    htm: 'text/html; charset=utf-8',
    css: 'text/css; charset=utf-8',
    js: 'text/javascript; charset=utf-8',
    mjs: 'text/javascript; charset=utf-8',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    avif: 'image/avif',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    otf: 'font/otf',
    txt: 'text/plain; charset=utf-8',
    webmanifest: 'application/manifest+json',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    ogg: 'audio/ogg',
    wav: 'audio/wav'
};

const csp = [
    "default-src 'self' https: data: blob:",
    "script-src 'self' https: 'unsafe-inline' 'unsafe-eval' blob:",
    "style-src 'self' https: 'unsafe-inline'",
    "img-src * data: blob:",
    "font-src * data:",
    "media-src * data: blob:",
    "connect-src *",
    "frame-src https:",
    "form-action 'none'",
    "frame-ancestors 'self'",
    "base-uri 'none'",
    "object-src 'none'"
].join('; ');

export function GET({ params, cookies }) {
    // Vérifier que le projet existe
    const project = get(params.id);

    if (!project) {
        error(404, 'Projet introuvable');
    }

    // Seuls les projets approuvés sont publics
    if (!project.approved && !isAdmin(cookies)) {
        error(404, 'Projet non disponible');
    }

    // Fichier demandé, index.html par défaut
    const name = params.path || 'index.html';
    const ext = name.split('.').pop().toLowerCase();

    // Refuser les types de fichiers inconnus
    if (!types[ext]) {
        error(404, 'Type de fichier non autorisé');
    }

    // Lire le fichier du projet
    let bytes;

    try {
        bytes = file(params.id, name);
    } catch {
        error(404, 'Fichier introuvable');
    }

    // Renvoyer le fichier avec sa CSP
    return new Response(bytes, {
        headers: {
            'Content-Type': types[ext],
            'X-Content-Type-Options': 'nosniff',
            'Cache-Control': 'no-store',
            'Content-Security-Policy': csp,
            'Referrer-Policy': 'no-referrer'
        }
    });
}
