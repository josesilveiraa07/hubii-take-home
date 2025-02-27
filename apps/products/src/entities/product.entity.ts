export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockAmount: number;

  constructor(props: Product) {
    Object.assign(this, props);
  }
}
