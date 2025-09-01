import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
    permissionGranted: false,
  });

  const { toast } = useToast();

  const updateLocation = async (latitude: number, longitude: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('user_locations').insert({
        user_id: user.id,
        latitude,
        longitude,
      });
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation not supported' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const { latitude, longitude, accuracy } = position.coords;
      
      setState({
        latitude,
        longitude,
        accuracy,
        loading: false,
        error: null,
        permissionGranted: true,
      });

      await updateLocation(latitude, longitude);
      
      toast({
        title: "Location Updated",
        description: "Your location has been recorded for location-based reminders.",
      });
    } catch (error: any) {
      let errorMessage = 'Failed to get location';
      
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location permissions.';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable';
      } else if (error.code === 3) {
        errorMessage = 'Location request timeout';
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        permissionGranted: false,
      }));

      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const startWatching = () => {
    if (!navigator.geolocation) return null;

    return navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setState(prev => ({
          ...prev,
          latitude,
          longitude,
          accuracy,
          permissionGranted: true,
        }));
        updateLocation(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation watch error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000, // 1 minute
        timeout: 10000,
      }
    );
  };

  const checkNearbyReminders = async (userLat: number, userLng: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: reminders, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null);

      if (error) throw error;

      const nearbyReminders = reminders?.filter(reminder => {
        if (!reminder.location_lat || !reminder.location_lng) return false;
        
        const distance = calculateDistance(
          userLat,
          userLng,
          reminder.location_lat,
          reminder.location_lng
        );
        
        return distance <= (reminder.location_radius || 500); // Default 500m radius
      }) || [];

      return nearbyReminders;
    } catch (error) {
      console.error('Error checking nearby reminders:', error);
      return [];
    }
  };

  // Calculate distance between two coordinates in meters
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return {
    ...state,
    requestLocation,
    startWatching,
    checkNearbyReminders,
  };
};