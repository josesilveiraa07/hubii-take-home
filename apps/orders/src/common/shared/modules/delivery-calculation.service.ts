export abstract class DeliveryCalculationService {
  abstract calculatePrice(data: {
    origin: string;
    destination: string;
    weight: number;
    height: number;
    width: number;
    length: number;
  }): Promise<Record<string, { deliveryTime: string; price: string }>>;
}
