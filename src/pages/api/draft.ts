import type { APIRoute } from 'astro';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { createClient } from '@sanity/client';

export const GET: APIRoute = async ({ request, redirect, cookies }) => {
  // Trim for parity with src/lib/sanity.ts — env vars pasted from the Vercel
  // dashboard sometimes carry a trailing newline and Sanity rejects the token.
  const token = (import.meta.env.SANITY_API_READ_TOKEN || '').trim();
  if (!token) {
    return new Response('Missing SANITY_API_READ_TOKEN', { status: 500 });
  }

  const client = createClient({
    projectId: 'gk5zqp4d',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  });

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(client, request.url);

  if (!isValid) {
    return new Response('Invalid preview URL', { status: 401 });
  }

  cookies.set('__sanity_preview', 'true', {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 60 * 60,
  });

  return redirect(redirectTo, 307);
};
