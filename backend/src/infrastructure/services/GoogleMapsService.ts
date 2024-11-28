import { Client, TravelMode } from '@googlemaps/google-maps-services-js';
import { ILocationService, Location, RouteResponse } from '@/domain/interfaces/ILocationService';

export class GoogleMapsService implements ILocationService {
  private client: Client;

  constructor() {
    this.client = new Client({});
  }

  async calculateRoute(origin: string, destination: string): Promise<RouteResponse> {
    try {
      const response = await this.client.directions({
        params: {
          origin,
          destination,
          mode: TravelMode.driving,
          key: process.env.GOOGLE_API_KEY || ''
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Maps API error: ${response.data.status}`);
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];

      if (!leg.start_location || !leg.end_location) {
        throw new Error('Invalid route response from Google Maps API');
      }

      return {
        distance: leg.distance?.value || 0,
        duration: leg.duration?.text || '',
        origin: {
          latitude: leg.start_location.lat,
          longitude: leg.start_location.lng
        },
        destination: {
          latitude: leg.end_location.lat,
          longitude: leg.end_location.lng
        },
        raw: route
      };
    } catch (error) {
      throw new Error(`Failed to calculate route: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
