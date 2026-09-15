import { createClient } from 'contentful';

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '2s0ipkw96zqi',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'R9fDDBQrI2fQfoUZURua4UxRyBW-G-FvxAcH0-ho8pk',
});