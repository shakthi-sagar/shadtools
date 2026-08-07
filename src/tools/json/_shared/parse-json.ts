export function safeParseJson(input: string): { success: boolean; data?: unknown; error?: string } {
  try {
    const data = JSON.parse(input);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Invalid JSON format' };
  }
}
