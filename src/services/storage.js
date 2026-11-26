const DB_NAME = 'pylevel';
const DB_VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      ['profile','settings','problems','problemProgress','codeDrafts','submissions','mistakes','achievements','activity','assessments','savedSnippets','reviewSchedule','dailyChallenges','bookmarks','notes'].forEach(store => {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: 'id' });
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const storage = {
  async get(store, id) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async put(store, value) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(value);
      tx.oncomplete = () => resolve(value);
      tx.onerror = () => reject(tx.error);
    });
  },
  async all(store) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async remove(store, id) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
};

export function progressSnapshot() {
  try {
    const saved = localStorage.getItem('xpc-progress');
    if (saved) return JSON.parse(saved);
    const legacy = localStorage.getItem('pylevel-progress');
    if (!legacy) return {};
    const parsed = JSON.parse(legacy);
    localStorage.setItem('xpc-progress', JSON.stringify(parsed));
    return parsed;
  } catch {
    return {};
  }
}

export function saveProgress(snapshot) {
  localStorage.setItem('xpc-progress', JSON.stringify(snapshot));
  localStorage.setItem('pylevel-progress', JSON.stringify(snapshot));
}
