import { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
  onLocationSelect: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  selectedLocation?: {
    address: string;
    latitude: number;
    longitude: number;
  } | null;
}

export const LocationPicker = ({ onLocationSelect, selectedLocation }: LocationPickerProps) => {
  const [address, setAddress] = useState(selectedLocation?.address || '');
  const [isSearching, setIsSearching] = useState(false);
  const { requestLocation, latitude, longitude, loading } = useGeolocation();
  const { toast } = useToast();

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Use OpenStreetMap Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        return data.display_name;
      }
      return `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      return `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const geocodeAddress = async (address: string) => {
    try {
      // Use OpenStreetMap Nominatim API for geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          address: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleCurrentLocation = async () => {
    await requestLocation();
    
    if (latitude && longitude) {
      const resolvedAddress = await reverseGeocode(latitude, longitude);
      setAddress(resolvedAddress);
      onLocationSelect({
        address: resolvedAddress,
        latitude,
        longitude,
      });
    }
  };

  const handleAddressSearch = async () => {
    if (!address.trim()) {
      toast({
        title: "Please enter an address",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const result = await geocodeAddress(address.trim());
      
      if (result) {
        onLocationSelect({
          address: result.address,
          latitude: result.latitude,
          longitude: result.longitude,
        });

        toast({
          title: "Location Found",
          description: "Address has been added to your reminder.",
        });
      } else {
        toast({
          title: "Location Not Found",
          description: "Could not find this address. Please try a different one.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Reminder Location (Optional)</Label>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Enter address or location"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddressSearch}
            disabled={isSearching}
            size="sm"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleCurrentLocation}
          disabled={loading}
          className="w-full"
        >
          <Navigation className="w-4 h-4 mr-2" />
          {loading ? 'Getting location...' : 'Use Current Location'}
        </Button>

        {selectedLocation && (
          <Card className="border-primary/20">
            <CardContent className="p-3">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{selectedLocation.address}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAddress('');
                    onLocationSelect({ address: '', latitude: 0, longitude: 0 });
                  }}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};