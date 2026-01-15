import fs from 'fs';
import path from 'path';

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

let cachedConfig: ZoneConfig | null = null;

/**
 * Validates basic zone configuration structure
 */
function validateZoneConfig(config: any): config is ZoneConfig {
  if (!config || typeof config !== 'object') {
    return false;
  }

  // Validate required top-level properties
  if (
    !config.zone ||
    !config.branding ||
    !config.terminology ||
    !config.features
  ) {
    return false;
  }

  // Validate zone
  if (!config.zone.name || !config.zone.description || !config.zone.domain) {
    return false;
  }

  // Validate branding
  if (
    !config.branding.displayName ||
    !config.branding.logo ||
    !config.branding.logo.path
  ) {
    return false;
  }

  // Validate terminology
  if (
    !config.terminology.account ||
    !config.terminology.entity ||
    !config.terminology.service
  ) {
    return false;
  }

  return true;
}

/**
 * Load zone configuration from the specified config file
 * Defaults to ZONE_CONFIG_PATH environment variable or 'furever.zone.json'
 */
export function loadZoneConfig(): ZoneConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const configPath = process.env.ZONE_CONFIG_PATH || 'furever.zone.json';
  const fullPath = path.join(process.cwd(), configPath);

  try {
    const configFile = fs.readFileSync(fullPath, 'utf-8');
    const parsedConfig = JSON.parse(configFile);

    if (!validateZoneConfig(parsedConfig)) {
      throw new Error(
        'Zone configuration is invalid or missing required fields'
      );
    }

    cachedConfig = parsedConfig;
    return cachedConfig;
  } catch (error) {
    console.error(`Failed to load zone config from ${fullPath}:`, error);
    throw new Error(
      `Zone configuration file not found or invalid: ${configPath}`
    );
  }
}

/**
 * Get the zone configuration (cached)
 */
export function getZoneConfig(): ZoneConfig {
  return loadZoneConfig();
}

/**
 * Reset the cached configuration (useful for testing)
 */
export function resetZoneConfigCache(): void {
  cachedConfig = null;
}
