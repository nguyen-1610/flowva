/**
 * Utility to generate consistent mock avatar URLs from local assets.
 * Uses a round-robin strategy based on the input ID or index.
 */

const AVATARS = ['/mock/avatars/gojo.jpg', '/mock/avatars/itahi.jpg', '/mock/avatars/levi.jpg'];

export const getMockAvatar = (idOrIndex: string | number): string => {
  let index: number;

  if (typeof idOrIndex === 'number') {
    index = Math.abs(Math.floor(idOrIndex));
  } else {
    // Sum char codes for string IDs to get a consistent number
    index = idOrIndex
      .toString()
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }

  return AVATARS[index % AVATARS.length];
};
