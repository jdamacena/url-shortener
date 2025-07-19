// Utility to extract the public path from Netlify Function events
export function getPublicPath(event) {
  return (
    event.path || (event.rawUrl ? new URL(event.rawUrl).pathname : "")
  );
}
