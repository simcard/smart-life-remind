import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface LocationNavigationProps {
  location: string;
  latitude?: number;
  longitude?: number;
  variant?: 'full' | 'compact';
}

export const LocationNavigation = ({ 
  location, 
  latitude, 
  longitude, 
  variant = 'full' 
}: LocationNavigationProps) => {
  
  const openInGoogleMaps = () => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
    }
  };

  const openInAppleMaps = () => {
    if (latitude && longitude) {
      window.open(`https://maps.apple.com/?daddr=${latitude},${longitude}`, '_blank');
    } else {
      window.open(`https://maps.apple.com/?q=${encodeURIComponent(location)}`, '_blank');
    }
  };

  const openInWaze = () => {
    if (latitude && longitude) {
      window.open(`https://waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes`, '_blank');
    } else {
      window.open(`https://waze.com/ul?q=${encodeURIComponent(location)}`, '_blank');
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <MapPin className="w-3 h-3" />
        <span className="truncate max-w-32">{location}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Navigation className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={openInGoogleMaps}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Google Maps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openInAppleMaps}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Apple Maps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openInWaze}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Waze
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2 flex-1">
            <MapPin className="w-4 h-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{location}</p>
              {latitude && longitude && (
                <p className="text-xs text-muted-foreground">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={openInGoogleMaps}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Google Maps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openInAppleMaps}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Apple Maps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openInWaze}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Waze
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};