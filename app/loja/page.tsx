"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";\nimport CartButton from "@/components/CartButton";\nimport { addToCart } from "@/lib/cart";

const wines = [
  {name:"Gran Reserva Malbec", winery:"Bodega Altura", year:"2022", rating:"4,4", reviews:"1.280", old:"R$ 229,90", price:"R$ 189,90", discount:"-17%", country:"Argentina", region:"Mendoza", grape:"Malbec", type:"Tinto", image:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=85"},
  {name:"Reserva Cabernet Sauvignon", winery:"Viña del Sur", year:"2021", rating:"4,3", reviews:"842", old:"R$ 179,90", price:"R$ 149,90", discount:"-16%", country:"Chile", region:"Maipo", grape:"Cabernet Sauvignon", type:"Tinto", image:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=700&q=85"},
  {name:"Sauvignon Blanc Reserva", winery:"Casa Costera", year:"2023", rating:"4,2", reviews:"619", old:"R$ 159,90", price:"R$ 129,90", discount:"-18%", country:"Chile", region:"Casablanca", grape:"Sauvignon Blanc", type:"Branco", image:"https://images.unsplash.com/photo-1566995541428-f2246c17cda1?auto=format&fit=crop&w=700&q=85"},
  {name:"Rosé de Provence", winery:"Maison Éloise", year:"2023", rating:"4,1", reviews:"397", old:"R$ 189,90", price:"R$ 159,90", discount:"-15%", country:"França", region:"Provence", grape:"Grenache", type:"Rosé", image:"https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=700&q=85"},
  {name:"Pinot Noir Reserva", winery:"Casa del Valle", year:"2022", rating:"4,5", reviews:"1.104", old:"R$ 249,90", price:"R$ 209,90", discount:"-16%", country:"Argentina", region:"Patagônia", grape:"Pinot Noir", type:"Tinto", image:"https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=700&q=85"},
  {name:"Brut Reserva", winery:"Serra Alta", year:"2023", rating:"4,2", reviews:"512", old:"R$ 149,90", price:"R$ 119,90", discount:"-20%", country:"Brasil", region:"Serra Gaúcha", grape:"Chardonnay", type:"Espumante", image:"https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=700&q=85"},
  {name:"Chardonnay Barricado", winery:"Valle Claro", year:"2022", rating:"4,0", reviews:"284", old:"R$ 169,90", price:"R$ 139,90", discount:"-17%", country:"Argentina", region:"Mendoza", grape:"Chardonnay", type:"Branco", image:"https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=700&q=85"},
  {name:"Syrah Gran Selección", winery:"Viña del Sur", year:"2021", rating:"4,4", reviews:"731", old:"R$ 199,90", price:"R$ 169,90", discount:"-15%", country:"Chile", region:"Colchagua", grape:"Syrah", type:"Tinto", image:"https://images.unsplash.com/photo-1515779122185-2390ccdf060b?auto=format&fit=crop&w=700&q=85"}
];

const money=(v:string)=>Number(v.replace(/[^\\d,]/g,"").replace(",","."));\nfunction Search(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>}
function Heart(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 8.6c0 5-8 10.4-8 10.4S4 13.6 4 8.6A4.6 4.6 0 0 1 12 5a4.6 4.6 0 0 1 8 3.6Z"/></svg>}
function WhatsappIcon(){return <svg viewBox="0 0 32 32" fill="currentColor"><path d="M16.02 5.2A10.7 10.7 0 0 0 6.8 21.34L5.2 26.8l5.6-1.48a10.72 10.72 0 1 0 5.22-20.12Zm0 19.5a8.73 8.73 0 0 1-4.46-1.22l-.32-.19-3.32.88.89-3.23-.2-.33A8.75 8.75 0 1 1 16.02 24.7Zm4.8-6.55c-.26-.13-1.56-.77-1.8-.86-.24-.09-.41-.13-.59.13-.17.26-.67.86-.82 1.04-.15.17-.3.2-.56.07-.26-.13-1.1-.41-2.1-1.3-.77-.69-1.3-1.54-1.45-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.07-.13-.59-1.42-.81-1.95-.21-.51-.43-.44-.59-.45h-.5c-.17 0-.46.07-.7.33-.24.26-.91.89-.91 2.17s.93 2.52 1.06 2.7c.13.17 1.83 2.8 4.44 3.93.62.27 1.1.43 1.48.55.62.2 1.19.17 1.64.1.5-.07 1.56-.64 1.78-1.26.22-.62.22-1.15.15-1.26-.06-.11-.24-.17-.5-.3Z"/></svg>}

export default function Loja(){
  const [query,setQuery]=useState("");
  const [type,setType]=useState("Todos");
  useEffect(()=>{
    const selected=new URLSearchParams(window.location.search).get("tipo");
    if(selected) setType(selected);
  },[]);
  const [country,setCountry]=useState("Todos");
  const [grape,setGrape]=useState("Todas");
  const [sort,setSort]=useState("relevancia");

  const filtered = useMemo(()=>{
    let result=wines.filter(w=>{
      const q=`${w.name} ${w.winery} ${w.country} ${w.region} ${w.grape} ${w.type}`.toLowerCase();
      return (!query || q.includes(query.toLowerCase())) &&
        (type==="Todos" || w.type===type) &&
        (country==="Todos" || w.country===country) &&
        (grape==="Todas" || w.grape===grape);
    });
    if(sort==="avaliacao") result=[...result].sort((a,b)=>Number(b.rating.replace(",","."))-Number(a.rating.replace(",",".")));
    if(sort==="menor") result=[...result].sort((a,b)=>Number(a.price.replace(/[^d,]/g,"").replace(",","."))-Number(b.price.replace(/[^d,]/g,"").replace(",",".")));
    return result;
  },[query,type,country,grape,sort]);

  const add=(w:(typeof wines)[number])=>addToCart({id:`${w.winery}-${w.name}-${w.year}`,name:`${w.name} ${w.year}`,winery:w.winery,year:w.year,price:money(w.price),image:w.image});\n\n  return <main>
    <div className="topbar">Entrega para Foz do Iguaçu e região · Atendimento pelo WhatsApp</div>
    <header className="header">
      <div className="headerTop">
        <a href="/" className="logo"><span className="logoMark">V</span><span>VIDEIRA</span></a>
        <div className="searchBox"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar vinho, bodega, uva ou região"/></div>
        <div className="actions"><a href="/">Início</a><CartButton/></div>
      </div>
      <nav className="nav"><a href="/loja" className="active">Loja</a><a href="/#vinhos">Vinhos</a><a href="/#bodegas">Bodegas</a><a href="/#uvas">Uvas</a><a href="/#ofertas">Ofertas</a></nav>
    </header>

    <section className="shopHero">
      <div><span>CATÁLOGO VIDEIRA</span><h1>Loja</h1><p>Encontre seu próximo vinho usando pesquisa e filtros.</p></div>
      <strong>{filtered.length} rótulos</strong>
    </section>

    <section className="shopLayout">
      <aside className="filters">
        <div className="filterHead"><b>Filtros</b><button onClick={()=>{setType("Todos");setCountry("Todos");setGrape("Todas");setQuery("")}}>Limpar</button></div>
        <label>Tipo de vinho<select value={type} onChange={e=>setType(e.target.value)}><option>Todos</option><option>Tinto</option><option>Branco</option><option>Rosé</option><option>Espumante</option></select></label>
        <label>País<select value={country} onChange={e=>setCountry(e.target.value)}><option>Todos</option><option>Argentina</option><option>Chile</option><option>França</option><option>Brasil</option></select></label>
        <label>Uva<select value={grape} onChange={e=>setGrape(e.target.value)}><option>Todas</option><option>Malbec</option><option>Cabernet Sauvignon</option><option>Sauvignon Blanc</option><option>Pinot Noir</option><option>Grenache</option><option>Chardonnay</option><option>Syrah</option></select></label>
      </aside>

      <div className="shopMain">
        <div className="shopToolbar">
          <div className="mobileSearch"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar vinhos"/></div>
          <span>{filtered.length} produtos</span>
          <label>Ordenar por <select value={sort} onChange={e=>setSort(e.target.value)}><option value="relevancia">Relevância</option><option value="avaliacao">Melhor avaliação</option><option value="menor">Menor preço</option></select></label>
        </div>

        <div className="shopGrid">
          {filtered.map(w=><article className="wineCard" key={w.name}>
            <div className="winePhoto"><Image src={w.image} alt={w.name} fill sizes="(max-width:700px) 46vw, 240px"/><span className="discount">{w.discount}</span><button className="fav"><Heart/></button></div>
            <div className="wineInfo"><p className="winery">{w.winery}</p><h3>{w.name} {w.year}</h3><p className="meta">{w.region}, {w.country} · {w.type}</p><div className="rating"><strong>{w.rating}</strong><span>★★★★★</span><small>({w.reviews})</small></div><div className="priceRow"><div><del>{w.old}</del><b>{w.price}</b></div><button onClick={()=>add(w)}>Adicionar</button></div></div>
          </article>)}
        </div>
        {!filtered.length && <div className="emptyState"><h2>Nenhum vinho encontrado</h2><p>Tente remover algum filtro ou pesquisar outro termo.</p></div>}
      </div>
    </section>

    <footer><div className="footerLogo"><span className="logoMark">V</span><b>VIDEIRA</b><p>Vinhos & curadoria</p></div><div><b>Comprar</b><a href="/loja">Vinhos</a><a href="/loja">Ofertas</a><a href="/loja">Bodegas</a></div><div><b>Redes sociais</b><a href="https://instagram.com/videiravinhoteca" target="_blank">@videiravinhoteca</a><a href="https://wa.me/5545999056277" target="_blank">WhatsApp · 45 99905-6277</a></div><small>© 2026 Videira · Venda proibida para menores de 18 anos.</small></footer>\n    <a className="whatsapp" href="https://wa.me/5545999056277" target="_blank" aria-label="WhatsApp"><WhatsappIcon/></a>
  </main>
}
