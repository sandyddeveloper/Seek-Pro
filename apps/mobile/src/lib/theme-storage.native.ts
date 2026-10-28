import Storage from 'expo-sqlite/kv-store';

export function getThemePreference(key: string) {
  return Storage.getItem(key);
}

export function saveThemePreference(key: string, value: string) {
  return Storage.setItem(key, value);
}
