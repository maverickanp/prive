import { Client } from '@googlemaps/google-maps-services-js';
import { GoogleMapsService } from '@/infrastructure/services/GoogleMapsService';

// Mock do Client do Google Maps
jest.mock('@googlemaps/google-maps-services-js', () => ({
  Client: jest.fn(),
  TravelMode: {
    driving: 'driving'
  }
}));

describe('GoogleMapsService', () => {
  let service: GoogleMapsService;
  let mockDirections: jest.Mock;

  beforeEach(() => {
    // Configura o mock das directions
    mockDirections = jest.fn();
    (Client as jest.Mock).mockImplementation(() => ({
      directions: mockDirections
    }));

    service = new GoogleMapsService();
  });

  it('should calculate route successfully', async () => {
    // Prepara o mock de resposta do Google Maps
    const mockResponse = {
      data: {
        status: 'OK',
        routes: [{
          legs: [{
            distance: { value: 5000 },
            duration: { text: '15 mins' },
            start_location: { lat: -23.5505, lng: -46.6333 },
            end_location: { lat: -23.5605, lng: -46.6433 }
          }]
        }]
      }
    };

    mockDirections.mockResolvedValue(mockResponse);

    // Executa o teste
    const result = await service.calculateRoute(
      'Av. Paulista, São Paulo',
      'Pinheiros, São Paulo'
    );

    // Verifica o resultado
    expect(result).toEqual({
      distance: 5000,
      duration: '15 mins',
      origin: {
        latitude: -23.5505,
        longitude: -46.6333
      },
      destination: {
        latitude: -23.5605,
        longitude: -46.6433
      },
      raw: mockResponse.data.routes[0]
    });

    // Verifica se a chamada foi feita corretamente
    expect(mockDirections).toHaveBeenCalledWith({
      params: {
        origin: 'Av. Paulista, São Paulo',
        destination: 'Pinheiros, São Paulo',
        mode: 'driving',
        key: expect.any(String)
      }
    });
  });

  it('should throw error when Google Maps API returns non-OK status', async () => {
    // Prepara o mock de erro
    mockDirections.mockResolvedValue({
      data: { status: 'ZERO_RESULTS' }
    });

    // Verifica se a exceção é lançada
    await expect(
      service.calculateRoute('Invalid Origin', 'Invalid Destination')
    ).rejects.toThrow('Google Maps API error: ZERO_RESULTS');
  });

  it('should throw error when route data is invalid', async () => {
    // Prepara o mock com dados inválidos
    mockDirections.mockResolvedValue({
      data: {
        status: 'OK',
        routes: [{ legs: [{}] }]
      }
    });

    // Verifica se a exceção é lançada
    await expect(
      service.calculateRoute('Origin', 'Destination')
    ).rejects.toThrow('Invalid route response from Google Maps API');
  });

  it('should handle API errors gracefully', async () => {
    // Simula um erro de rede
    mockDirections.mockRejectedValue(new Error('Network error'));

    // Verifica se a exceção é lançada com a mensagem correta
    await expect(
      service.calculateRoute('Origin', 'Destination')
    ).rejects.toThrow('Failed to calculate route: Network error');
  });
});