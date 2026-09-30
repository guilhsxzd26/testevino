export type CartItem = {
  id: string;
  name: string;
  winery: string;
  year?: string | number;
  price: number;
  image: string;
  qty: number;
};

const KEY = "videira-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("videira-cart-updated"));
}

export function addToCart(item: Omit<CartItem,"qty">) {
  const cart = getCart();
  const found = cart.find(x => x.id === item.id);
  if (found) found.qty += 1;
  else cart.push({...item, qty:1});
  saveCart(cart);
}

export function cartCount() {
  return getCart().reduce((sum,item)=>sum+item.qty,0);
}
