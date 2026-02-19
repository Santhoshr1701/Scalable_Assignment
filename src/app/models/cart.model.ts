export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}