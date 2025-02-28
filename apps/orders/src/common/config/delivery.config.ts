import { registerAs } from '@nestjs/config';

export default registerAs('delivery', () => ({
  provider: process.env.DELIVERY_PROVIDER!,
  apiKey: process.env.DELIVERY_API_KEY!,
  baseUrl: process.env.DELIVERY_BASE_URL!,
}));
