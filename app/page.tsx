"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const wines = [
  {name:"Gran Reserva Malbec", winery:"Bodega Altura", year:"2022", rating:"4,4", reviews:"1.280", old:"R$ 229,90", price:"R$ 189,90", discount:"-17%", country:"Argentina", type:"Tinto", image:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=85"},
  {name:"Reserva Cabernet Sauvignon", winery:"Viña del Sur", year:"2021", rating:"4,3", reviews:"842", old:"R$ 179,90", price:"R$ 149,90", discount:"-16%", country:"Chile", type:"Tinto", image:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=700&q=85"},
  {name:"Sauvignon Blanc Reserva", winery:"Casa Costera", year:"2023", rating:"4,2", reviews:"619", old:"R$ 159,90", price:"R$ 129,90", discount:"-18%", country:"Chile", type:"Branco", image:"https://images.unsplash.com/photo-1566995541428-f2246c17cda1?auto=format&fit=crop&w=700&q=85"},
  {name:"Rosé de Provence", winery:"Maison Éloise", year:"2023", rating:"4,1", reviews:"397", old:"R$ 189,90", price:"R$ 159,90", discount:"-15%", country:"França", type:"Rosé", image:"https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=700&q=85"},
  {name:"Pinot Noir Reserva", winery:"Casa del Valle", year:"2022", rating:"4,5", reviews:"1.104", old:"R$ 249,90", price:"R$ 209,90", discount:"-16%", country:"Argentina", type:"Tinto", image:"https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=700&q=85"}
];

const categories = ["Tinto","Branco","Rosé","Espumante","Sobremesa","Fortificado"];

function Icon({name}:{name:"search"|"bag"|"user"|"heart"|"menu"|"chev"}) {
  const p = {
    search:<><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></>,
    bag:<><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    user:<><circle cx="12" cy="8" r="3.3"/><path d="M5.5 20c.6-4.3 3-6.5 6.5-6.5s5.9 2.2 6.5 6.5"/></>,
    heart:<path d="M20 8.6c0 5-8 10.4-8 10.4S4 13.6 4 8.6A4.6 4.6 0 0 1 12 5a4.6 4.6 0 0 1 8 3.6Z"/>,
    menu:<path d="M4 7h16M4 12h16M4 17h16"/>,
    chev:<path d="m9 6 6 6-6 6"/>
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{p[name]}</svg>;
}

function WineCard({wine}:{wine:(typeof wines)[number]}) {
  return <article className="wineCard">
    <div className="winePhoto">
      <Image src={wine.image} alt={wine.name} fill sizes="260px"/>
      <span className="discount">{wine.discount}</span>
      <button className="fav" aria-label="Favoritar"><Icon name="heart"/></button>
    </div>
    <div className="wineInfo">
      <p className="winery">{wine.winery}</p>
      <h3>{wine.name} {wine.year}</h3>
      <p className="meta">{wine.country} · {wine.type}</p>
      <div className="rating"><strong>{wine.rating}</strong><span>★★★★★</span><small>({wine.reviews})</small></div>
      <div className="priceRow"><div><del>{wine.old}</del><b>{wine.price}</b></div><button>Adicionar</button></div>
    </div>
  </article>
}

export default function Home(){
  const [query,setQuery]=useState("");
  const [menu,setMenu]=useState(false);
  const filtered=useMemo(()=>wines.filter(w=>`${w.name} ${w.winery} ${w.country} ${w.type}`.toLowerCase().includes(query.toLowerCase())),[query]);

  return <main>
    <div className="topbar">Entrega para Foz do Iguaçu e região · Atendimento pelo WhatsApp</div>

    <header className="header">
      <div className="headerTop">
        <button className="menuBtn" onClick={()=>setMenu(!menu)}><Icon name="menu"/></button>
        <a href="#" className="logo"><span className="logoMark">V</span><span>VIDEIRA</span></a>
        <div className="searchBox"><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar vinhos"/></div>
        <div className="actions"><button><Icon name="user"/></button><button><Icon name="bag"/><span className="count">0</span></button></div>
      </div>
      <nav className={menu?"nav open":"nav"}>
        <a href="#loja">Loja</a><a href="#vinhos">Vinhos</a><a href="#bodegas">Bodegas</a><a href="#uvas">Uvas</a><a href="#ofertas">Ofertas</a>
      </nav>
    </header>

    <section className="hero">
      <div>
        <span className="pill">SELEÇÃO VIDEIRA</span>
        <h1>Encontre o vinho certo para cada momento.</h1>
        <p>Explore rótulos selecionados, compare estilos e encontre novas garrafas para descobrir.</p>
        <a href="#vinhos" className="heroBtn">Explorar vinhos</a>
      </div>
      <div className="heroCard">
        <span>Escolha da casa</span><strong>Malbec argentino</strong><small>Frutado · intenso · elegante</small>
      </div>
    </section>

    <section className="content" id="loja">
      <h2>Compre vinhos bem avaliados</h2>
      <div className="categoryRow">{categories.map(c=><button key={c}>{c}</button>)}</div>

      <section className="shelf" id="ofertas">
        <div className="shelfHead"><div><h2>Ofertas para você</h2><p>Ótimo custo-benefício em rótulos selecionados.</p></div><a href="#">Ver tudo <Icon name="chev"/></a></div>
        <div className="wineRail">{(query?filtered:wines).map(w=><WineCard key={w.name} wine={w}/>)}</div>
      </section>

      <section className="benefitGrid">
        <div><b>Curadoria especializada</b><span>Rótulos escolhidos com critério.</span></div>
        <div><b>Compra simples</b><span>Escolha, adicione e finalize pelo atendimento.</span></div>
        <div><b>Atendimento humano</b><span>Ajuda para encontrar o vinho ideal.</span></div>
      </section>

      <section className="shelf" id="vinhos">
        <div className="shelfHead"><div><h2>Mais procurados</h2><p>Os rótulos que estão chamando mais atenção.</p></div><a href="#">Ver tudo <Icon name="chev"/></a></div>
        <div className="wineRail">{wines.slice().reverse().map(w=><WineCard key={w.name+"2"} wine={w}/>)}</div>
      </section>

      <section className="styles">
        <h2>Explore por estilo</h2>
        <div className="styleCards">
          <a href="#"><strong>Tintos encorpados</strong><span>Cabernet · Malbec · Syrah</span></a>
          <a href="#"><strong>Brancos frescos</strong><span>Sauvignon · Chardonnay</span></a>
          <a href="#"><strong>Rosés leves</strong><span>Provence · Grenache</span></a>
          <a href="#"><strong>Espumantes</strong><span>Brut · Extra Brut</span></a>
        </div>
      </section>

      <section className="newsletter">
        <div><span>VIDEIRA</span><h2>Descubra novos rótulos.</h2><p>Receba novidades, seleções e ofertas especiais.</p></div>
        <div><input placeholder="Seu melhor e-mail"/><button>Quero receber</button></div>
      </section>
    </section>

    <footer>
      <div className="footerLogo"><span className="logoMark">V</span><b>VIDEIRA</b><p>Vinhos & curadoria</p></div>
      <div><b>Comprar</b><a href="#vinhos">Vinhos</a><a href="#ofertas">Ofertas</a><a href="#bodegas">Bodegas</a></div>
      <div><b>Ajuda</b><a href="#">WhatsApp</a><a href="#">Instagram</a><a href="#">Entrega</a></div>
      <small>© 2026 Videira · Venda proibida para menores de 18 anos.</small>
    </footer>
    <a className="whatsapp" href="https://wa.me/" aria-label="WhatsApp">WA</a>
  </main>
}
