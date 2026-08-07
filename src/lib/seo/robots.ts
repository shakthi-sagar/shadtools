export function buildRobotsMeta(noindex = false): string {
  return noindex ? 'noindex, nofollow' : 'index, follow';
}
