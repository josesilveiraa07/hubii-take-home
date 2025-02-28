import { createMock } from '@golevelup/ts-jest'; // Importando createMock
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import deliveryConfigProvider from '../../config/delivery.config';
import { MelhorEnvioDeliveryCalculationService } from './impl/melhorenvio-delivery-calculation.service';

describe('MelhorEnvioDeliveryCalculationService', () => {
  let service: MelhorEnvioDeliveryCalculationService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MelhorEnvioDeliveryCalculationService,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
        {
          provide: deliveryConfigProvider.KEY,
          useValue: {
            baseUrl: 'https://api.melhorenvio.com',
            apiKey: 'fake-api-key',
            provider: 'melhorenvio',
          },
        },
      ],
    }).compile();

    service = module.get<MelhorEnvioDeliveryCalculationService>(
      MelhorEnvioDeliveryCalculationService,
    );
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePrice', () => {
    it('should return delivery options with price and delivery time', async () => {
      const mockResponse = [
        {
          id: 1,
          company: {
            id: 1,
            name: 'Transportadora A',
          },
          price: 50.0,
          currency: 'R$',
          delivery_time: 5,
        },
        {
          id: 2,
          company: {
            id: 2,
            name: 'Transportadora B',
          },
          price: 60.0,
          currency: 'R$',
          delivery_time: 3,
        },
      ];

      httpService.post = jest.fn().mockReturnValue(
        of({
          data: mockResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        }),
      );

      const result = await service.calculatePrice({
        origin: '01001000',
        destination: '02002000',
        weight: 1,
        height: 10,
        width: 10,
        length: 10,
      });

      expect(result).toEqual({
        'Transportadora A': {
          deliveryTime: '5 dias úteis',
          price: 50.0,
        },
        'Transportadora B': {
          deliveryTime: '3 dias úteis',
          price: 60.0,
        },
      });

      expect(httpService.post).toHaveBeenCalledWith(
        'https://api.melhorenvio.com/me/shipment/calculate',
        {
          from: {
            postal_code: '01001000',
          },
          to: {
            postal_code: '02002000',
          },
          products: [
            {
              width: 10,
              height: 10,
              length: 10,
              weight: 1,
            },
          ],
        },
        {
          headers: {
            Authorization: 'Bearer fake-api-key',
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
    });

    it('should handle empty or invalid responses', async () => {
      httpService.post = jest.fn().mockReturnValue(
        of({
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        }),
      );

      const result = await service.calculatePrice({
        origin: '01001000',
        destination: '02002000',
        weight: 1,
        height: 10,
        width: 10,
        length: 10,
      });

      expect(result).toEqual({});
    });
  });
});
