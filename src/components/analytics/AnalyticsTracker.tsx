'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isAnalyticsTrackingEnabled, logUserBehavior, scheduleAnalyticsInit } from '@/lib/firebaseClient';

type TrackableElement = HTMLElement & {
  dataset: DOMStringMap;
};

type AnalyticsParamValue = string | number | boolean | null | undefined;

const toSnakeCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/-/g, '_')
    .toLowerCase();

const parseDatasetValue = (value: string): AnalyticsParamValue => {
  if (value === 'true') return true;
  if (value === 'false') return false;

  const asNumber = Number(value);
  if (!Number.isNaN(asNumber) && value.trim() !== '') {
    return asNumber;
  }

  return value;
};

const buildEventParams = (element: TrackableElement, pathname: string) => {
  const params: Record<string, AnalyticsParamValue> = {
    source_page: pathname,
  };

  for (const [key, rawValue] of Object.entries(element.dataset)) {
    if (!key.startsWith('analyticsParam') || rawValue == null) continue;

    const suffix = key.slice('analyticsParam'.length);
    if (!suffix) continue;

    const paramName = toSnakeCase(suffix.charAt(0).toLowerCase() + suffix.slice(1));
    params[paramName] = parseDatasetValue(rawValue);
  }

  if (element instanceof HTMLAnchorElement) {
    const href = element.href;
    if (href) {
      params.destination_path_or_url = href;
      try {
        const url = new URL(href);
        params.destination_type = url.origin === window.location.origin ? 'internal' : 'external';
      } catch {
        params.destination_type = href.startsWith('/') ? 'internal' : 'external';
      }
    }
  }

  return params;
};

export default function AnalyticsTracker() {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAnalyticsTrackingEnabled) {
      scheduleAnalyticsInit();
    }
  }, []);

  useEffect(() => {
    if (!isAnalyticsTrackingEnabled) {
      return;
    }

    logUserBehavior('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pathname,
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isAnalyticsTrackingEnabled) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trackable = target.closest('[data-analytics-event]') as TrackableElement | null;
      if (!trackable) return;

      const eventName = trackable.dataset.analyticsEvent;
      if (!eventName) return;

      const eventParams = buildEventParams(trackable, pathname);
      logUserBehavior(eventName, eventParams);
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname]);

  return null;
}
