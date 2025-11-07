import Constants from "expo-constants";

export const API_URL =
  (Constants.expoConfig?.extra as any)?.API_URL ||
  (Constants.manifest?.extra as any)?.API_URL ||
  "http://localhost:4000";
