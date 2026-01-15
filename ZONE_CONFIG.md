# Zone Configuration Guide

This repository has been generalized into a template system that can be configured for any vertical/platform using zone configuration files.

## Overview

The zone configuration system allows you to:

- Customize branding (logos, colors, names)
- Define platform-specific terminology
- Configure features and messaging
- Adapt the application to different verticals (e.g., pet grooming, fitness, bookstores, etc.)

## Quick Start

1. **Choose a Configuration Method:**

   - Use the default `furever.zone.json` (pet grooming demo)
   - Copy `zone.example.json` to create your own
   - Create a new zone config from scratch

2. **Set Environment Variable (Optional):**

   ```bash
   # In your .env file
   ZONE_CONFIG_PATH="your-zone.json"
   ```

   If not set, defaults to `furever.zone.json`

3. **Run the Application:**
   ```bash
   npm install
   npm run dev
   ```

## Configuration Structure

### Basic Configuration

```json
{
  "zone": {
    "name": "YourPlatform",
    "description": "What your platform does",
    "domain": "yoursite.com"
  },
  "branding": {
    "displayName": "YourBrand",
    "tagline": "Your main headline",
    "heroDescription": "Description for landing page",
    "logo": {
      "path": "/logo.png",
      "alt": "Your logo"
    },
    "favicon": "/favicon.png",
    "heroImage": "/hero.jpg"
  }
}
```

### Terminology Mapping

Define how your platform refers to different concepts:

```json
{
  "terminology": {
    "account": {
      "singular": "business", // e.g., "salon", "studio", "store"
      "plural": "businesses"
    },
    "entity": {
      "singular": "item", // e.g., "pet", "book", "member"
      "plural": "items",
      "displayName": "Items" // Used in navigation
    },
    "service": {
      "provider": "provider", // e.g., "groomer", "trainer", "instructor"
      "session": "session", // e.g., "appointment", "class", "booking"
      "schedule": "schedule" // e.g., "calendar", "timetable"
    }
  }
}
```

### Features Section

Configure up to 3 feature cards for your landing page:

```json
{
  "features": {
    "title": "Everything you need to manage your business.",
    "description": "FEATURES",
    "items": [
      {
        "title": "Feature 1",
        "description": "Description of feature",
        "icon": "CalendarCheck" // Lucide icon name
      }
    ]
  }
}
```

**Available Icons:** Any icon from [Lucide React](https://lucide.dev/icons/) can be used.

### Testimonials & CTA

```json
{
  "testimonial": {
    "quote": "Customer testimonial text",
    "author": "Customer Name",
    "authorTitle": "Company",
    "authorImage": "/testimonial-portrait.jpg",
    "image": "/testimonial.jpeg"
  },
  "cta": {
    "title": "Get started today.",
    "description": "Join our platform"
  }
}
```

### Stripe Configuration

```json
{
  "stripe": {
    "statementDescriptor": "YOURCO",
    "supportEmail": "support@yoursite.com",
    "supportUrl": "https://yoursite.com"
  }
}
```

## Example Configurations

### Pet Grooming (FurEver - Default)

See `furever.zone.json` for the full pet grooming salon configuration.

### Fitness Studio

```json
{
  "zone": {
    "name": "FitFlow",
    "description": "A platform for fitness studios",
    "domain": "fitflow.example.com"
  },
  "branding": {
    "displayName": "FitFlow",
    "tagline": "Power your fitness business.",
    "heroDescription": "FitFlow helps fitness studios manage classes, payments, and grow their business."
  },
  "terminology": {
    "account": {
      "singular": "studio",
      "plural": "studios"
    },
    "entity": {
      "singular": "member",
      "plural": "members",
      "displayName": "Members"
    },
    "service": {
      "provider": "instructor",
      "session": "class",
      "schedule": "calendar"
    }
  }
}
```

### Bookstore

```json
{
  "zone": {
    "name": "BookNest",
    "description": "A platform for independent bookstores",
    "domain": "booknest.example.com"
  },
  "terminology": {
    "account": {
      "singular": "bookstore",
      "plural": "bookstores"
    },
    "entity": {
      "singular": "book",
      "plural": "books",
      "displayName": "Catalog"
    },
    "service": {
      "provider": "staff",
      "session": "event",
      "schedule": "events"
    }
  }
}
```

## Customization Beyond Configuration

### Assets

Place your custom assets in the `/public` directory:

- Logo: `/logo.png`
- Favicon: `/favicon.png`
- Hero image: `/hero-image.jpeg`
- Testimonial images

### Data Files

The configuration can point to custom data files:

```json
{
  "data": {
    "entities": "/app/data/your-entities.json",
    "schedule": "/app/data/your-schedule.json"
  }
}
```

## Schema Validation

The configuration schema is defined in `zone.config.schema.json`. You can use it for IDE autocomplete and validation:

```json
{
  "$schema": "./zone.config.schema.json",
  ...
}
```

## Best Practices

1. **Start with an Example:** Copy `zone.example.json` or `furever.zone.json` as a starting point
2. **Test Thoroughly:** After changing configuration, test all pages to ensure terminology makes sense
3. **Keep Branding Consistent:** Use consistent terminology throughout your configuration
4. **Optimize Images:** Ensure all images are optimized for web (WebP format recommended)
5. **Statement Descriptors:** Keep Stripe statement descriptors under 22 characters

## Deployment

### Using Environment Variables

For different environments (dev, staging, production):

```bash
# Development
ZONE_CONFIG_PATH="dev.zone.json"

# Production
ZONE_CONFIG_PATH="production.zone.json"
```

### Multiple Instances

You can run multiple instances of the platform with different configurations:

```bash
# Instance 1 (Fitness)
ZONE_CONFIG_PATH="fitness.zone.json" PORT=3001 npm start

# Instance 2 (Bookstore)
ZONE_CONFIG_PATH="bookstore.zone.json" PORT=3002 npm start
```

## Troubleshooting

### Configuration Not Loading

- Check the file path in `ZONE_CONFIG_PATH`
- Ensure the JSON is valid (use a JSON validator)
- Check console for error messages

### Missing Branding

- Verify all required fields are present in your config
- Check that image paths are correct and files exist in `/public`

### Terminology Issues

- Ensure singular/plural forms are consistent
- Test all pages after changing terminology
- Some pages may need manual adjustment for complex terminology changes

## Support

For issues or questions:

1. Check the schema: `zone.config.schema.json`
2. Review example configs: `furever.zone.json` and `zone.example.json`
3. Check the main README.md for general setup instructions

## Future Enhancements

Potential improvements to the zone system:

- Multi-language support
- Theme customization beyond colors
- Dynamic data loading
- Per-zone feature flags
- Advanced scheduling configurations
