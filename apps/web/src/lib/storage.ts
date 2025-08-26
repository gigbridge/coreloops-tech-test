export enum StorageKeys {
  AccessToken = 'access_token',
  User = 'user',
  CurrentProjectId = 'current_project_id',
}
export const setStorageItem = (key: StorageKeys, value: string) => {
  localStorage.setItem(key, value);
};

export const getStorageItem = (key: StorageKeys) => {
  return localStorage.getItem(key);
};

export const removeStorageItem = (key: StorageKeys) => {
  localStorage.removeItem(key);
};
