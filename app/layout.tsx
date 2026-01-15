'use client';

import {Inter as FontSans} from 'next/font/google';
import {cn} from '@/lib/utils';
import './globals.css';
import NextAuthProvider from './auth';
import DebugMenu from '@/app/components/debug/DebugMenu';
import {SettingsProvider} from '@/app/contexts/settings';
import {EmbeddedComponentBorderProvider} from '@/app/hooks/EmbeddedComponentBorderProvider';
import QueryProvider from '@/app/providers/QueryProvider';
import {useSession} from 'next-auth/react';
import {useEffect} from 'react';
import {useZoneConfig} from '@/app/hooks/useZoneConfig';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

function DynamicTitle() {
  const {data: session} = useSession();
  const {config} = useZoneConfig();

  useEffect(() => {
    const defaultName = config?.branding?.displayName || 'Platform';
    const companyName = session?.user?.companyName || defaultName;
    document.title =
      companyName === defaultName ? companyName : `(DEMO) ${companyName}`;
  }, [session?.user?.companyName, config?.branding?.displayName]);

  return null;
}

function DynamicFavicon() {
  const {data: session} = useSession();
  const {config} = useZoneConfig();
  const defaultFavicon = config?.branding?.favicon || '/favicon.png';

  useEffect(() => {
    const companyLogo = session?.user?.companyLogoUrl;
    const link =
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
      document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = companyLogo || defaultFavicon;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [session?.user?.companyLogoUrl, defaultFavicon]);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Stripe Connect Demo</title>
      </head>
      <body
        className={cn(
          'min-h-screen bg-offset font-sans antialiased',
          fontSans.variable
        )}
      >
        <NextAuthProvider>
          <QueryProvider>
            <DynamicTitle />
            <DynamicFavicon />
            <SettingsProvider>
              <EmbeddedComponentBorderProvider>
                {children}
              </EmbeddedComponentBorderProvider>
              <DebugMenu />
            </SettingsProvider>
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
