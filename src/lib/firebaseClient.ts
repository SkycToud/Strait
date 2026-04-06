import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

const isBrowser = typeof window !== "undefined";
const isDebugAnalyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";

export const isAnalyticsTrackingEnabled =
  isBrowser &&
  Boolean(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) &&
  (process.env.NODE_ENV === "production" || isDebugAnalyticsEnabled);

let analyticsInstancePromise: Promise<Analytics | null> | null = null;

const getAnalyticsInstance = () => {
  if (!isAnalyticsTrackingEnabled) {
    return Promise.resolve(null);
  }

  if (!analyticsInstancePromise) {
    analyticsInstancePromise = isSupported()
      .then((supported) => {
        if (!supported) {
          return null;
        }
        return getAnalytics(app);
      })
      .catch(() => null);
  }

  return analyticsInstancePromise;
};

export const logUserBehavior = async (eventName: string, eventParams?: AnalyticsEventParams) => {
  if (!isAnalyticsTrackingEnabled) {
    return;
  }

  try {
    const analytics = await getAnalyticsInstance();
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Firebase Analytics Error:", error);
    }
  }
};
