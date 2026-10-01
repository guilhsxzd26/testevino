"use client";

import { useEffect, useMemo, useState } from "react";
import { CartItem, getCart, saveCart } from "@/lib/cart";
import CartButton from "@/components/CartButton";

const WA="5545999056277";
const brl=(n:number)=>Number.isFinite(n)?n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):"R$ 0,00";

export default function Carrinho(){
  const [items,setItems]=useState<CartItem[]>([]);
  const [mounted,setMounted]=useState(false);
  const [loadError,setLoadError]=useState("");

  useEffect(()=>{
    try{
      setItems(getCart());
      setMounted(true);
    }catch{
      setItems([]);
      setLoadError("Não foi possível ler o carrinho salvo neste navegador.");
      setMounted(true);
    }
  },[]);

  const sync=(next:CartItem[])=>{
    try{
      setItems(next);
      saveCart(next);
    }catch{
      setLoadError("Não foi possível atualizar o carrinho.");
    }
  };

  const change=(id:string,delta:number)=>sync(items.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+delta)}:x));
  const remove=(id:string)=>sync(items.filter(x=>x.id!==id));
  const total=useMemo(()=>items.reduce((s,x)=>s+(Number(x.price)||0)*(Number(x.qty)||0),0),[items]);

  const quote=()=>{
    if(!items.length)return;
    const lines=items.map(x=>"• "+x.qty+"x "+x.name+" — "+brl((Number(x.price)||0)*x.qty)).join("\n");
    const msg="Olá! Gostaria de solicitar um orçamento na Videira Vinhoteca:\n\n"+lines+"\n\nTotal estimado: "+brl(total)+"\n\nPodem confirmar disponibilidade e condições?";
    window.location.href="https://wa.me/"+WA+"?text="+encodeURIComponent(msg);
  };

  if(!mounted){
    return <main className="cartLoading"><div><span>VIDEIRA</span><h1>Carregando carrinho...</h1></div></main>;
  }

  return <main>
    <div className="topbar">Videira Vinhoteca · orçamento pelo WhatsApp</div>
    <header className="header">
      <div className="headerTop cartHeader">
        <a href="/" className="logo"><span className="logoMark">V</span><span>VIDEIRA</span></a>
        <a href="/loja" className="backShop">← Continuar comprando</a>
        <div className="actions"><CartButton/></div>
      </div>
    </header>

    <section className="cartPage">
      <div className="cartTitle"><span>SEU PEDIDO</span><h1>Carrinho</h1><p>{items.reduce((s,x)=>s+x.qty,0)} item(ns)</p></div>
      {loadError&&<div className="cartNotice">{loadError}</div>}

      {!items.length ? <div className="cartEmpty">
        <div className="emptyBag">◯</div>
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione alguns vinhos para montar seu orçamento.</p>
        <a href="/loja">Ir para a loja</a>
      </div> :
      <div className="cartLayout">
        <div className="cartList">
          {items.map(item=><article className="cartItem" key={item.id}>
            <div className="cartThumb"><img src={item.image} alt={item.name}/></div>
            <div className="cartInfo"><small>{item.winery}</small><h3>{item.name}</h3><b>{brl(Number(item.price)||0)}</b></div>
            <div className="qty"><button onClick={()=>change(item.id,-1)} aria-label="Diminuir">−</button><span>{item.qty}</span><button onClick={()=>change(item.id,1)} aria-label="Aumentar">+</button></div>
            <strong>{brl((Number(item.price)||0)*item.qty)}</strong>
            <button className="removeItem" onClick={()=>remove(item.id)}>Remover</button>
          </article>)}
        </div>

        <aside className="cartSummary">
          <span className="summaryKicker">ORÇAMENTO</span>
          <h2>Resumo</h2>
          <div><span>Subtotal estimado</span><strong>{brl(total)}</strong></div>
          <p>O valor final, disponibilidade e entrega serão confirmados pelo atendimento da Videira.</p>
          <button onClick={quote}>Pedir orçamento no WhatsApp</button>
          <a href="/loja">Continuar comprando</a>
        </aside>
      </div>}
    </section>
  </main>
}
