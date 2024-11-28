export interface Location {
  latitude: number;
  longitude: number;
}

export interface RouteResponse {
  distance: number;
  duration: string;
  origin: Location;
  destination: Location;
  raw: any;
}

export interface ILocationService {
  calculateRoute(origin: string, destination: string): Promise<RouteResponse>;
}