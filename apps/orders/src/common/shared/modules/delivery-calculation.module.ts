import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import deliveryConfigProvider from '../../config/delivery.config';
import { DeliveryCalculationService } from './delivery-calculation.service';
import { MelhorEnvioDeliveryCalculationService } from './impl/melhorenvio-delivery-calculation.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: DeliveryCalculationService,
      inject: [HttpService, deliveryConfigProvider.KEY],
      useFactory: (
        httpService: HttpService,
        deliveryConfig: ConfigType<typeof deliveryConfigProvider>,
      ) => {
        const providers = {
          melhorenvio: new MelhorEnvioDeliveryCalculationService(
            httpService,
            deliveryConfig,
          ),
        };

        const provider = deliveryConfig.provider;

        if (!providers[provider]) {
          throw new Error(`Provider for ${provider} is not registered`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return providers[provider];
      },
    },
  ],
  exports: [DeliveryCalculationService],
})
export class DeliveryCalculationModule {}
