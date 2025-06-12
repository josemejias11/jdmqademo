export function generateRandomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}