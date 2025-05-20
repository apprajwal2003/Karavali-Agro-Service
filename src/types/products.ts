// types/Product.ts

export interface Product {
  productId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  brand: string;
  image: string; // URL or path to the product image
}
