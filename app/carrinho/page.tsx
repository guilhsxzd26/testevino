"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CartItem, getCart, saveCart } from "@/lib/cart";
import CartButton from "@/components/CartButton";

const WA="5545999056277";
const brl=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

export default function Carrinho(){
  const [items,setItems]=useState<CartItem[]>([]);
  useEffect(()=>setItems(getCart()),[]);
  const sync=(next:CartItem[])=>{setItems(next);saveCart(next)};
  const change=(id:string,delta:number)=>sync(items.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+delta)}:x));
  const remove=(id:string)=>sync(items.filter(x=>x.id!==id));
  const total=useMemo(()=>items.reduce((s,x)=>s+x.price*x.qty,0),[items]);
  const quote=()=>{
    const lines=items.map(x=>`• ${x.qty}x ${x.name} — ${brl(x.price*x.qty)}`).join("\n");
    const msg=`Olá! Gostaria de solicitar um orçamento na Videira Vinhoteca:\n\n${lines}\n\nTotal estimado: ${brl(total)}\n\nPodem confirmar disponibilidade e condições?`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,"_blank");
  };
  return <main>
    <div className="topbar">Videira Vinhoteca · orçamento pelo WhatsApp</div>
    <header className="header"><div className="headerTop cartHeader"><a href="/" className="logo"><span className="logoMark">V</span><span>VIDEIRA</span></a><a href="/loja" className="backShop">← Continuar comprando</a><div className="actions"><CartButton/></div></div></header>
    <section className="cartPage">
      <div className="cartTitle"><span>SEU PEDIDO</span><h1>Carrinho</h1><p>{items.reduce((s,x)=>s+x.qty,0)} item(ns)</p></div>
      {!items.length ? <div className="cartEmpty"><h2>Seu carrinho está vazio</h2><p>Adicione alguns vinhos para montar seu orçamento.</p><a href="/loja">Ir para a loja</a></div> :
      <div className="cartLayout">
        <div className="cartList">{items.map(item=><article className="cartItem" key={item.id}>
          <div className="cartThumb"><Image src={item.image} alt={item.name} fill sizes="90px"/></div>
          <div className="cartInfo"><small>{item.winery}</small><h3>{item.name}</h3><b>{brl(item.price)}</b></div>
          <div className="qty"><button onClick={()=>change(item.id,-1)}>−</button><span>{item.qty}</span><button onClick={()=>change(item.id,1)}>+</button></div>
          <strong>{brl(item.price*item.qty)}</strong><button className="removeItem" onClick={()=>remove(item.id)}>Remover</button>
        </article>)}</div>
        <aside className="cartSummary"><h2>Resumo</h2><div><span>Subtotal</span><strong>{brl(total)}</strong></div><p>O valor final, disponibilidade e entrega serão confirmados no atendimento.</p><button onClick={quote}>Pedir orçamento no WhatsApp</button></aside>
      </div>}
    </section>
  </main>
}
