export type AnalyticsEvent =
  | 'tool_open'
  | 'tool_execute'
  | 'tool_copy'
  | 'tool_share'
  | 'tool_error'
  | 'search_used'
  | 'dashboard_pin'
  | 'dashboard_unpin';

export interface AnalyticsProperties {
  tool_key?: string;
  category?: string;
  action_type?: string;
  mode?: string;
  success?: boolean;
  input_size_bucket?: string;
  output_size_bucket?: string;
  query_length?: number;
  [key: string]: unknown;
}

/** Categorizes payload byte lengths into privacy-preserving size buckets. */
export function getPayloadSizeBucket(sizeInBytes: number): string {
  if (sizeInBytes <= 0) return '0B';
  if (sizeInBytes < 100) return '<100B';
  if (sizeInBytes < 1000) return '100B-1KB';
  if (sizeInBytes < 10000) return '1KB-10KB';
  if (sizeInBytes < 100000) return '10KB-100KB';
  return '>100KB';
}

/** Centralized privacy-safe analytics dispatcher. */
export function track(event: AnalyticsEvent, properties: AnalyticsProperties = {}): void {
  try {
    const sanitizedProps: Record<string, unknown> = {
      tool_key: properties.tool_key,
      category: properties.category,
      action_type: properties.action_type,
      mode: properties.mode,
      success: properties.success,
      input_size_bucket: properties.input_size_bucket,
      output_size_bucket: properties.output_size_bucket,
    };

    if (typeof properties.query_length === 'number') {
      sanitizedProps.query_length = properties.query_length;
    }

    // Cloudflare Web Analytics / Window custom event dispatch
    if (typeof window !== 'undefined') {
      const customEvent = new CustomEvent('shadtools:analytics', {
        detail: { event, properties: sanitizedProps },
      });
      window.dispatchEvent(customEvent);

      // Cloudflare Beacon event integration (if available)
      const cfBeacon = (window as any).__cfBeacon;
      if (cfBeacon && typeof cfBeacon.track === 'function') {
        cfBeacon.track(event, sanitizedProps);
      }
    }
  } catch {
    // Non-blocking guard: analytics errors must never interrupt application execution
  }
}
