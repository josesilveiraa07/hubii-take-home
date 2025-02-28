export class MelhorEnvioShipmentCalculateResponseDto {
  id: number;
  name: string;
  error?: string;
  company: {
    id: number;
    name: string;
    picture: string;
  };
  price?: number;
  custom_price?: number;
  discount?: number;
  currency?: number;
  delivery_time?: number;
}
