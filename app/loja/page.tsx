"use client";

import { useEffect, useMemo, useState } from "react";
import CartButton from "@/components/CartButton";
import { addToCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";

type Wine={
  id:string; name:string; winery:string|null; vintage:number|null; rating:number|null; review_count:number|null;
  old_price:number|null; price:number|null; discount_pct:number|null; country:string|null; region:string|null;
  grapes:string[]; type:string; image_url:string|null; active:boolean;
};

const fallback="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=85";
const brl=(n:number|null)=>n==null?"Sob consulta":n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function Search(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>}
function Heart(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 8.6c0 5-8 10.4-8 10.4S4 13.6 4 8.6A4.6 4.6 0 0 1 12 5a4.6 4.6 0 0 1 8 3.6Z"/></svg>}

export default function Loja(){
  const [wines,setWines]=useState<Wine[]>([]);
  const [query,setQuery]=useState("");
  const [type,setType]=useState("Todos");
  const [country,setCountry]=useState("Todos");
  const [grape,setGrape]=useState("Todas");
  const [winery,setWinery]=useState("Todas");
  const [sort,setSort]=useState("relevancia");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    (async()=>{
      const params=new URLSearchParams(window.location.search);
      if(params.get("tipo")) setType(params.get("tipo")!);
      if(params.get("uva")) setGrape(params.get("uva")!);
      if(params.get("bodega")) setWinery(params.get("bodega")!);
      const {data}=await supabase.from("wines").select("*").eq("active",true).order("sort_order");
      setWines(data||[]);
      setLoading(false);
    })();
  },[]);

  const filtered=useMemo(()=>{
    let result=wines.filter(w=>{
      const text=[w.name,w.winery,w.country,w.region,...(w.grapes||[]),w.type].join(" ").toLowerCase();
      return (!query||text.includes(query.toLowerCase()))
        &&(type==="Todos"||w.type===type)
        &&(country==="Todos"||w.country===country)
        &&(grape==="Todas"||(w.grapes||[]).includes(grape))
        &&(winery==="Todas"||w.winery===winery);
    });
    if(sort==="avaliacao") result=[...result].sort((a,b)=>(b.rating||0)-(a.rating||0));
    if(sort==="menor") result=[...result].sort((a,b)=>(a.price??999999)-(b.price??999999));
    return result;
  },[wines,query,type,country,grape,winery,sort]);

  const countries=[...new Set(wines.map(w=>w.country).filter(Boolean))] as string[];
  const grapes=[...new Set(wines.flatMap(w=>w.grapes||[]))];
  const wineries=[...new Set(wines.map(w=>w.winery).filter(Boolean))] as string[];
  const types=[...new Set(wines.map(w=>w.type).filter(Boolean))];

  const add=(w:Wine)=>{
    addToCart({id:w.id,name:[w.name,w.vintage].filter(Boolean).join(" "),winery:w.winery||"Videira",year:w.vintage||"",price:Number(w.price)||0,image:w.image_url||fallback});
  };

  return <main>
    <div className="topbar">Entrega para Foz do Iguaçu e região · Atendimento pelo WhatsApp</div>
    <header className="header">
      <div className="headerTop">
        <a href="/" className="logo"><span className="logoMark">V</span><span>VIDEIRA</span></a>
        <div className="searchBox"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar vinho, bodega, uva ou região"/></div>
        <div className="actions"><a href="/">Início</a><CartButton/></div>
      </div>
      <nav className="nav"><a href="/loja" className="active">Loja</a><a href="/loja">Vinhos</a><a href="/loja">Bodegas</a><a href="/loja">Uvas</a><a href="/#ofertas">Ofertas</a></nav>
    </header>

    <section className="shopHero"><div><span>CATÁLOGO VIDEIRA</span><h1>Loja</h1><p>Encontre seu próximo vinho usando pesquisa e filtros.</p></div><strong>{filtered.length} rótulos</strong></section>

    <div className="shopSearchWrap"><div className="shopSearchLive"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar vinhos, bodegas, uvas ou regiões"/><span>{query?`${filtered.length} resultado(s)`:"Busca em tempo real"}</span></div></div>

    <section className="shopLayout">
      <aside className="filters">
        <div className="filterHead"><b>Filtros</b><button onClick={()=>{setType("Todos");setCountry("Todos");setGrape("Todas");setWinery("Todas");setQuery("")}}>Limpar</button></div>
        <label>Tipo de vinho<select value={type} onChange={e=>setType(e.target.value)}><option>Todos</option>{types.map(x=><option key={x}>{x}</option>)}</select></label>
        <label>País<select value={country} onChange={e=>setCountry(e.target.value)}><option>Todos</option>{countries.map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Uva<select value={grape} onChange={e=>setGrape(e.target.value)}><option>Todas</option>{grapes.map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Bodega<select value={winery} onChange={e=>setWinery(e.target.value)}><option>Todas</option>{wineries.map(x=><option key={x}>{x}</option>)}</select></label>
      </aside>

      <div className="shopMain">
        <div className="shopToolbar"><span>{loading?"Carregando...":filtered.length+" produtos"}</span><label>Ordenar por <select value={sort} onChange={e=>setSort(e.target.value)}><option value="relevancia">Relevância</option><option value="avaliacao">Melhor avaliação</option><option value="menor">Menor preço</option></select></label></div>
        <div className="shopGrid">
          {filtered.map(w=><article className="wineCard" key={w.id}>
            <a className="productLink" href={"/produto/"+w.id}>
              <div className="winePhoto"><img src={w.image_url||fallback} alt={w.name}/>{w.discount_pct? <span className="discount">-{w.discount_pct}%</span>:null}<button className="fav" type="button" onClick={e=>e.preventDefault()}><Heart/></button></div>
              <div className="wineInfo"><p className="winery">{w.winery}</p><h3>{w.name} {w.vintage||""}</h3><p className="meta">{[w.region,w.country,w.type].filter(Boolean).join(" · ")}</p><div className="rating"><strong>{String(w.rating??4.3).replace(".",",")}</strong><span>★★★★★</span><small>({w.review_count??0})</small></div></div>
            </a>
            <div className="priceRow shopCardPrice"><div>{w.old_price&&<del>{brl(w.old_price)}</del>}<b>{brl(w.price)}</b></div><button onClick={()=>add(w)}>Adicionar</button></div>
          </article>)}
        </div>
        {!loading&&!filtered.length&&<div className="emptyState"><h2>Nenhum vinho encontrado</h2><p>Tente remover algum filtro ou pesquisar outro termo.</p></div>}
      </div>
    </section>
  </main>
}