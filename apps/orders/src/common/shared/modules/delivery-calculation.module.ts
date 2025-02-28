import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DeliveryCalculationService } from './delivery-calculation.service';
import { MelhorEnvioDeliveryCalculationService } from './impl/melhorenvio-delivery-calculation.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: DeliveryCalculationService,
      useClass: MelhorEnvioDeliveryCalculationService,
    },
  ],
  exports: [DeliveryCalculationService],
})
export class DeliveryCalculationModule {}
