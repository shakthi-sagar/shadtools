export function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateUuidBatch(count: number, uppercase = false, hyphens = true): string[] {
  const safeCount = Math.max(1, Math.min(count, 100));
  const list: string[] = [];

  for (let i = 0; i < safeCount; i++) {
    let uuid = generateUuidV4();
    if (!hyphens) {
      uuid = uuid.replace(/-/g, '');
    }
    if (uppercase) {
      uuid = uuid.toUpperCase();
    }
    list.push(uuid);
  }

  return list;
}
