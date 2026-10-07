import { useMemo } from 'react';
import { usePostHog } from 'posthog-react-native';

type AnalyticsValue = string | number | boolean | null;
export type AnalyticsProperties = Record<string, AnalyticsValue>;

export function useAnalytics() {
  const posthog = usePostHog();

  return useMemo(() => ({
    capture(event: string, properties?: AnalyticsProperties) {
      posthog.capture(event, properties);
    },
    screen(name: string, properties?: AnalyticsProperties) {
      posthog.screen(name, properties);
    },
    info(message: string, properties?: AnalyticsProperties) {
      posthog.logger.info(message, properties);
    },
    warn(message: string, properties?: AnalyticsProperties) {
      posthog.logger.warn(message, properties);
    },
    error(message: string, error?: unknown, properties?: AnalyticsProperties) {
      posthog.logger.error(message, {
        ...properties,
        error_name: error instanceof Error ? error.name : 'UnknownError',
        error_message: error instanceof Error ? error.message : String(error ?? 'Unknown error')
      });
    }
  }), [posthog]);
}
