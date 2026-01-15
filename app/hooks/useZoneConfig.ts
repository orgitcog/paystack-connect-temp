'use client';

import {useQuery} from '@tanstack/react-query';
import type {ZoneConfig} from '@/lib/zoneConfig';

export function useZoneConfig() {
  const {data, isLoading, error} = useQuery<ZoneConfig>({
    queryKey: ['zoneConfig'],
    queryFn: async () => {
      const response = await fetch('/api/zone_config');
      if (!response.ok) {
        throw new Error('Failed to fetch zone config');
      }
      return response.json();
    },
    staleTime: Infinity, // Config rarely changes, cache indefinitely
    gcTime: Infinity,
  });

  return {
    config: data,
    isLoading,
    error,
  };
}
