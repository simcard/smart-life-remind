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

  const handleCurrentLocation = async () => {
    await requestLocation();
    
    if (latitude && longitude) {
      // Use reverse geocoding to get address (simplified for demo)
      const generatedAddress = `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      setAddress(generatedAddress);
      onLocationSelect({
        address: generatedAddress,
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
      // In a real app, you would use a geocoding service like Google Maps Geocoding API
      // For demo purposes, we'll simulate coordinates
      const mockCoordinates = {
        latitude: -26.2041 + (Math.random() - 0.5) * 0.1, // Johannesburg area
        longitude: 28.0473 + (Math.random() - 0.5) * 0.1,
      };

      onLocationSelect({
        address: address.trim(),
        latitude: mockCoordinates.latitude,
        longitude: mockCoordinates.longitude,
      });

      toast({
        title: "Location Set",
        description: "Address has been added to your reminder.",
      });
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