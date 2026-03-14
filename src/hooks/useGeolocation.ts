import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import getApi from '@/api/client';

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
      const token = localStorage.getItem('token');
      if (!token) return;
      const api = getApi();
      await api.post('/locations', { latitude, longitude });
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
          maximumAge: 300000,
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
        maximumAge: 60000,
        timeout: 10000,
      }
    );
  };

  const checkNearbyReminders = async (userLat: number, userLng: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return [];
      const api = getApi();
      const response = await api.get('/locations/nearby-reminders', {
        params: { lat: userLat, lng: userLng },
      });
      return response.data || [];
    } catch (error) {
      console.error('Error checking nearby reminders:', error);
      return [];
    }
  };

  return {
    ...state,
    requestLocation,
    startWatching,
    checkNearbyReminders,
  };
};
