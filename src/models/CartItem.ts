export type Cart = {
  data: {
    cart: {
      items: CartItem[]
    }
  }
};

export type CartItem = {
  product_id: string;
  count: number;
};
