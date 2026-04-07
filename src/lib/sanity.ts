import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = import.meta.env.SANITY_PROJECT_ID;

export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset: import.meta.env.SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      useCdn: false,
    })
  : null;

export async function fetchSanity<T>(query: string): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query);
  } catch {
    return null;
  }
}

export function urlFor(source: SanityImageSource) {
  if (!sanityClient) return null;
  return imageUrlBuilder(sanityClient).image(source);
}
