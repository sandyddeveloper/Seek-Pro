export async function getThemePreference(key: string) {
  return globalThis.localStorage.getItem(key);
}

export async function saveThemePreference(key: string, value: string) {
  globalThis.localStorage.setItem(key, value);
}
