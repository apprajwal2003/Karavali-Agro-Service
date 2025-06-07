// types/products.ts
export interface CategoryType {
  _id: string;
  name: string;
}

export interface ProductType {
  _id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  category?: CategoryType;
}
