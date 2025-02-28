import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import deliveryConfigProvider from '../../../config/delivery.config';
import { DeliveryCalculationService } from '../delivery-calculation.service';
import { MelhorEnvioShipmentCalculateResponseDto } from '../dto/melhorenvio-shipment-calculate-response.dto';

@Injectable()
export class MelhorEnvioDeliveryCalculationService
  implements DeliveryCalculationService
{
  private readonly baseUrl: string;
  private token: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(deliveryConfigProvider.KEY)
    readonly deliveryConfig: ConfigType<typeof deliveryConfigProvider>,
  ) {
    this.baseUrl = deliveryConfig.baseUrl;
    this.token = deliveryConfig.apiKey;
  }

  async calculatePrice(data: {
    origin: string;
    destination: string;
    weight: number;
    height: number;
    width: number;
    length: number;
  }): Promise<Record<string, { deliveryTime: string; price: number }>> {
    const { data: responseData } = await firstValueFrom(
      this.httpService.post<MelhorEnvioShipmentCalculateResponseDto[]>(
        `${this.baseUrl}/me/shipment/calculate`,
        {
          from: {
            postal_code: data.origin,
          },
          to: {
            postal_code: data.destination,
          },
          products: [
            {
              width: data.width,
              height: data.height,
              length: data.length,
              weight: data.weight,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return responseData.reduce(
      (acc, curr) => {
        if (curr.price) {
          acc[curr.company.name] = {
            deliveryTime:
              curr.delivery_time === 1
                ? '1 dia útil'
                : `${curr.delivery_time} dias úteis`,
            price: Number(curr.price),
          };
        }

        return acc;
      },
      {} as Record<string, { deliveryTime: string; price: number }>,
    );
  }
}
