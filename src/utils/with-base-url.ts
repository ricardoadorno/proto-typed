export const withBaseUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  return `${baseUrl}${path}`;
};

export const withPublicUrl = (path: string) => {
  const publicUrl = process.env.NEXT_PUBLIC_URL || '';
  return `${publicUrl}${path}`;
};