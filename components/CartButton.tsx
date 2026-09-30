"use client";
import { useEffect, useState } from "react";
import { cartCount } from "@/lib/cart";

export default function CartButton(){
  const [count,setCount]=useState(0);
  useEffect(()=>{
    const refresh=()=>setCount(cartCount());
    refresh();
    window.addEventListener("storage",refresh);
    window.addEventListener("videira-cart-updated",refresh);
    return ()=>{window.removeEventListener("storage",refresh);window.removeEventListener("videira-cart-updated",refresh)};
  },[]);
  return <a href="/carrinho" className="cartButton" aria-label="Abrir carrinho">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>
    <span className="count">{count}</span>
  </a>
}
