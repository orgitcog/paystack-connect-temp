'use client';

import React, {createContext, useContext} from 'react';

export interface ZoneConfig {
  zone: {
    name: string;
    description: string;
    domain: string;
  };
  branding: {
    displayName: string;
    tagline: string;
    heroDescription: string;
    logo: {
      path: string;
      alt: string;
    };
    favicon: string;
    heroImage: string;
    primaryColor?: string;
    accentColor?: string;
  };
  terminology: {
    account: {
      singular: string;
      plural: string;
    };
    entity: {
      singular: string;
      plural: string;
      displayName: string;
    };
    service: {
      provider: string;
      session: string;
      schedule: string;
    };
  };
  features: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  testimonial?: {
    quote: string;
    author: string;
    authorTitle: string;
    authorImage: string;
    image: string;
  };
  cta?: {
    title: string;
    description: string;
  };
  data?: {
    entities?: string;
    schedule?: string;
  };
  stripe?: {
    statementDescriptor?: string;
    supportEmail?: string;
    supportUrl?: string;
  };
}

const ZoneConfigContext = createContext<ZoneConfig | null>(null);

export function ZoneConfigProvider({
  config,
  children,
}: {
  config: ZoneConfig;
  children: React.ReactNode;
}) {
  return (
    <ZoneConfigContext.Provider value={config}>
      {children}
    </ZoneConfigContext.Provider>
  );
}

export function useZoneConfig(): ZoneConfig {
  const context = useContext(ZoneConfigContext);
  if (!context) {
    throw new Error('useZoneConfig must be used within a ZoneConfigProvider');
  }
  return context;
}
