import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Trim to defuse env vars pasted with trailing newlines (Sanity client rejects projectId with \n)
const projectId = (import.meta.env.SANITY_PROJECT_ID || 'gk5zqp4d').trim();
const dataset = (import.meta.env.SANITY_DATASET || 'production').trim();
const token = (import.meta.env.SANITY_API_READ_TOKEN || '').trim();

export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: false,
    })
  : null;

export function getClient(preview = false): SanityClient | null {
  if (!sanityClient) return null;
  if (preview && token) {
    return sanityClient.withConfig({
      token,
      perspective: 'previewDrafts',
      useCdn: false,
      stega: {
        enabled: true,
        studioUrl: '/admin',
      },
    });
  }
  return sanityClient;
}

export async function fetchSanity<T>(query: string, preview = false): Promise<T | null> {
  const client = getClient(preview);
  if (!client) return null;
  try {
    return await client.fetch<T>(query);
  } catch {
    return null;
  }
}

export function urlFor(source: SanityImageSource) {
  if (!sanityClient) return null;
  return imageUrlBuilder(sanityClient).image(source);
}
