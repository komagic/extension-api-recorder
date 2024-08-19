export default function extractUrlParams(url) {
  if (!url) return null;
  const params = {};
  const queryString = url.split('?')[1];

  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
  }

  return params;
}
