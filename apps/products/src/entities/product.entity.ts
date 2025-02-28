export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  width: number;
  height: number;
  length: number;
  stockAmount: number;

  constructor(props: Product) {
    Object.assign(this, props);
  }
}
