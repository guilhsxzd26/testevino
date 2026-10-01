"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { addToCart } from "@/lib/cart";

export type RailWine = {
  id?: string; name:string; winery:string; year?:string|number; rating:string; reviews:string;
  old:string; price:string; discount:string; country:string; type:string; image:string;
};

function money(v:string){ return Number(v.replace(/[^\d,]/g,"").replace(",",".")); }
function Heart(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 8.6c0 5-8 10.4-8 10.4S4 13.6 4 8.6A4.6 4.6 0 0 1 12 5a4.6 4.6 0 0 1 8 3.6Z"/></svg>}

function Card({wine}:{wine:RailWine}){
  const [added,setAdded]=useState(false);
  const id=wine.id || `${wine.winery}-${wine.name}-${wine.year||""}`;
  const add=()=>{
    addToCart({id,name:`${wine.name} ${wine.year||""}`.trim(),winery:wine.winery,year:wine.year,price:money(wine.price),image:wine.image});
    setAdded(true); setTimeout(()=>setAdded(false),900);
  };
  return <article className="wineCard">\n    <a className="productLink" href={wine.id?`/produto/${wine.id}`:"#"} draggable={false}>
    <div className="winePhoto">
      <Image src={wine.image} alt={wine.name} fill sizes="260px"/>
      <span className="discount">{wine.discount}</span>
      <button className="fav" aria-label="Favoritar"><Heart/></button>
    </div>
    <div className="wineInfo">
      <p className="winery">{wine.winery}</p>
      <h3>{wine.name} {wine.year}</h3>
      <p className="meta">{wine.country} · {wine.type}</p>
      <div className="rating"><strong>{wine.rating}</strong><span>★★★★★</span><small>({wine.reviews})</small></div>
      <div className="priceRow"><div><del>{wine.old}</del><b>{wine.price}</b></div><button onClick={add}>{added?"Adicionado ✓":"Adicionar"}</button></div>
    </div>
  </article>
}

export default function ProductRail({items}:{items:RailWine[]}){
  const base=useMemo(()=>items.slice(0,15),[items]);
  const looped=useMemo(()=>[...base,...base,...base],[base]);
  const ref=useRef<HTMLDivElement>(null);
  const drag=useRef({down:false,x:0,left:0,moved:false});

  useEffect(()=>{
    const el=ref.current;if(!el||!base.length)return;
    requestAnimationFrame(()=>{ el.scrollLeft=el.scrollWidth/3; });
  },[base.length]);

  const onScroll=()=>{
    const el=ref.current;if(!el)return;
    const third=el.scrollWidth/3;
    if(el.scrollLeft < third*.25) el.scrollLeft += third;
    else if(el.scrollLeft > third*1.75) el.scrollLeft -= third;
  };
  const down=(e:React.PointerEvent<HTMLDivElement>)=>{
    const el=ref.current;if(!el)return;
    drag.current={down:true,x:e.clientX,left:el.scrollLeft,moved:false};
    el.setPointerCapture(e.pointerId); el.classList.add("dragging");
  };
  const move=(e:React.PointerEvent<HTMLDivElement>)=>{
    if(!drag.current.down||!ref.current)return;
    const dx=e.clientX-drag.current.x; if(Math.abs(dx)>4)drag.current.moved=true; ref.current.scrollLeft=drag.current.left-dx;
  };
  const up=(e:React.PointerEvent<HTMLDivElement>)=>{
    drag.current.down=false; ref.current?.classList.remove("dragging");
    try{ref.current?.releasePointerCapture(e.pointerId)}catch{}
  };
  if(!base.length)return null;
  return <div ref={ref} className="wineRail infiniteRail" onScroll={onScroll} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onDragStart={e=>e.preventDefault()} onClickCapture={e=>{if(drag.current.moved){e.preventDefault();e.stopPropagation();drag.current.moved=false}}}>
    {looped.map((w,i)=><Card key={`${w.name}-${i}`} wine={w}/>)}
  </div>
}
