// Utility to extract the public path from Netlify Function events
export function getPathSegments(event) {
  const rawPath =
    event.path || (event.rawUrl ? new URL(event.rawUrl).pathname : "");
  // split into segments and remove empty entries
  return rawPath.split("/").filter((segment) => segment);
}
