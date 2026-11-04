import packageJson from '../../package.json';

/**
 * Returns the application version extracted directly from package.json.
 *
 * @param prefix Whether to prepend 'v' to the version string (e.g. "v1.0.4"). Default is false.
 * @returns Formatted version string (e.g. "1.0.4" or "v1.0.4").
 */
export function getAppVersion(prefix = false): string {
  const version = packageJson.version || '1.0.0';
  return prefix ? `v${version}` : version;
}

export const APP_VERSION = packageJson.version || '1.0.0';
export const APP_VERSION_TAG = `v${APP_VERSION}`;

