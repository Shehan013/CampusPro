// Redirects to the welcome screen on app launch

import { Redirect } from 'expo-router';

export default function Index() {
  // @ts-ignore - Dynamic route will be registered after build
  return <Redirect href="/auth/welcome" />;
}
