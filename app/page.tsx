"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ProductRail from "@/components/ProductRail";
import CartButton from "@/components/CartButton";

const wines = [
  {name:"Gran Reserva Malbec", winery:"Bodega Altura", year:"2022", rating:"4,4", reviews:"1.280", old:"R$ 229,90", price:"R$ 189,90", discount:"-17%", country:"Argentina", type:"Tinto", image:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=85"},
  {name:"Reserva Cabernet Sauvignon", winery:"Viña del Sur", year:"2021", rating:"4,3", reviews:"842", old:"R$ 179,90", price:"R$ 149,90", discount:"-16%", country:"Chile", type:"Tinto", image:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=700&q=85"},
  {name:"Sauvignon Blanc Reserva", winery:"Casa Costera", year:"2023", rating:"4,2", reviews:"619", old:"R$ 159,90", price:"R$ 129,90", discount:"-18%", country:"Chile", type:"Branco", image:"https://images.unsplash.com/photo-1566995541428-f2246c17cda1?auto=format&fit=crop&w=700&q=85"},
  {name:"Rosé de Provence", winery:"Maison Éloise", year:"2023", rating:"4,1", reviews:"397", old:"R$ 189,90", price:"R$ 159,90", discount:"-15%", country:"França", type:"Rosé", image:"https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=700&q=85"},
  {name:"Pinot Noir Reserva", winery:"Casa del Valle", year:"2022", rating:"4,5", reviews:"1.104", old:"R$ 249,90", price:"R$ 209,90", discount:"-16%", country:"Argentina", type:"Tinto", image:"https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=700&q=85"},
  {name:"Cabernet Franc Reserva", winery:"Bodega Altura", year:"2022", rating:"4,3", reviews:"524", old:"R$ 209,90", price:"R$ 179,90", discount:"-14%", country:"Argentina", type:"Tinto", image:"https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=700&q=85"},
  {name:"Brut Nature", winery:"Serra Alta", year:"2023", rating:"4,2", reviews:"408", old:"R$ 169,90", price:"R$ 139,90", discount:"-18%", country:"Brasil", type:"Espumante", image:"https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=700&q=85"},
  {name:"Chardonnay Reserva", winery:"Valle Claro", year:"2023", rating:"4,1", reviews:"337", old:"R$ 159,90", price:"R$ 129,90", discount:"-18%", country:"Argentina", type:"Branco", image:"https://images.unsplash.com/photo-1566995541428-f2246c17cda1?auto=format&fit=crop&w=700&q=85"}
];

const categories = ["Tinto","Branco","Rosé","Espumante","Sobremesa","Fortificado"];
const grapes = [
  {name:"Malbec",desc:"Frutado, macio e intenso"},
  {name:"Cabernet Franc",desc:"Elegante, herbal e fresco"},
  {name:"Cabernet Sauvignon",desc:"Estruturado e clássico"},
  {name:"Pinot Noir",desc:"Leve, delicado e aromático"},
  {name:"Chardonnay",desc:"Versátil, fresco ou cremoso"},
  {name:"Sauvignon Blanc",desc:"Cítrico, vibrante e refrescante"},
  {name:"Syrah",desc:"Especiado, profundo e marcante"}
];

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


function InstagramIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>}
function SocialWhatsappIcon(){return <svg viewBox="0 0 32 32" fill="currentColor"><path d="M16.02 5.2A10.7 10.7 0 0 0 6.8 21.34L5.2 26.8l5.6-1.48a10.72 10.72 0 1 0 5.22-20.12Zm0 19.5a8.73 8.73 0 0 1-4.46-1.22l-.32-.19-3.32.88.89-3.23-.2-.33A8.75 8.75 0 1 1 16.02 24.7Zm4.8-6.55c-.26-.13-1.56-.77-1.8-.86-.24-.09-.41-.13-.59.13-.17.26-.67.86-.82 1.04-.15.17-.3.2-.56.07-.26-.13-1.1-.41-2.1-1.3-.77-.69-1.3-1.54-1.45-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.07-.13-.59-1.42-.81-1.95-.21-.51-.43-.44-.59-.45h-.5c-.17 0-.46.07-.7.33-.24.26-.91.89-.91 2.17s.93 2.52 1.06 2.7c.13.17 1.83 2.8 4.44 3.93.62.27 1.1.43 1.48.55.62.2 1.19.17 1.64.1.5-.07 1.56-.64 1.78-1.26.22-.62.22-1.15.15-1.26-.06-.11-.24-.17-.5-.3Z"/></svg>}

function WhatsappIcon(){
  return <svg viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
    <path d="M16.02 5.2A10.7 10.7 0 0 0 6.8 21.34L5.2 26.8l5.6-1.48a10.72 10.72 0 1 0 5.22-20.12Zm0 19.5a8.73 8.73 0 0 1-4.46-1.22l-.32-.19-3.32.88.89-3.23-.2-.33A8.75 8.75 0 1 1 16.02 24.7Zm4.8-6.55c-.26-.13-1.56-.77-1.8-.86-.24-.09-.41-.13-.59.13-.17.26-.67.86-.82 1.04-.15.17-.3.2-.56.07-.26-.13-1.1-.41-2.1-1.3-.77-.69-1.3-1.54-1.45-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.07-.13-.59-1.42-.81-1.95-.21-.51-.43-.44-.59-.45h-.5c-.17 0-.46.07-.7.33-.24.26-.91.89-.91 2.17s.93 2.52 1.06 2.7c.13.17 1.83 2.8 4.44 3.93.62.27 1.1.43 1.48.55.62.2 1.19.17 1.64.1.5-.07 1.56-.64 1.78-1.26.22-.62.22-1.15.15-1.26-.06-.11-.24-.17-.5-.3Z"/>
  </svg>
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
        <a href="/" className="logo"><span className="logoMark">V</span><span>VIDEIRA</span></a>
        <div className="searchBox"><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar vinhos"/></div>
        <div className="actions"><button><Icon name="user"/></button><CartButton/></div>
      </div>
      <nav className={menu?"nav open":"nav"}>
        <a href="/loja">Loja</a>
        <div className="navDrop"><a href="/loja">Vinhos</a><div className="dropdownPanel"><span>TIPOS DE VINHO</span><div>{categories.map(c=><a key={c} href={`/loja?tipo=${encodeURIComponent(c)}`}>{c}</a>)}</div></div></div>
        <div className="navDrop"><a href="/loja">Bodegas</a><div className="dropdownPanel wide"><span>BODEGAS</span><div>{["Bodega Altura","Viña del Sur","Casa Costera","Maison Éloise","Casa del Valle","Serra Alta","Valle Claro"].map(b=><a key={b} href={`/loja?bodega=${encodeURIComponent(b)}`}>{b}</a>)}</div></div></div>
        <div className="navDrop"><a href="#uvas">Uvas</a><div className="dropdownPanel wide"><span>UVAS</span><div>{grapes.map(g=><a key={g.name} href={`/loja?uva=${encodeURIComponent(g.name)}`}>{g.name}</a>)}</div></div></div>
        <a href="#ofertas">Ofertas</a>
      </nav>
    </header>

    <section className="hero">
      <div>
        <span className="pill">SELEÇÃO VIDEIRA</span>
        <h1>Encontre o vinho certo para cada momento.</h1>
        <p>Explore rótulos selecionados, compare estilos e encontre novas garrafas para descobrir.</p>
        <a href="/loja" className="heroBtn">Explorar vinhos</a>
      </div>
      <div className="heroCard">
        <span>Escolha da casa</span><strong>Malbec argentino</strong><small>Frutado · intenso · elegante</small>
      </div>
    </section>

    <section className="content">
      <h2>Compre vinhos bem avaliados</h2>
      <div className="categoryRow">{categories.map(c=><a href={`/loja?tipo=${encodeURIComponent(c)}`} key={c}>{c}</a>)}</div>

      <section className="shelf" id="ofertas">
        <div className="shelfHead"><div><h2>Ofertas para você</h2><p>Ótimo custo-benefício em rótulos selecionados.</p></div><a href="/loja">Ver tudo <Icon name="chev"/></a></div>
        <ProductRail items={query?filtered:wines}/>
      </section>

      <section className="shelf">
        <div className="shelfHead"><div><h2>Novidades</h2><p>Rótulos que acabaram de chegar à Videira.</p></div><a href="/loja">Ver tudo <Icon name="chev"/></a></div>
        <ProductRail items={wines.slice().reverse()}/>
      </section>

      <section className="shelf">
        <div className="shelfHead"><div><h2>Malbec</h2><p>Seleção de Malbecs para descobrir.</p></div><a href="/loja?uva=Malbec">Ver tudo <Icon name="chev"/></a></div>
        <ProductRail items={wines.filter(w=>w.name.toLowerCase().includes("malbec"))}/>
      </section>

      <section className="shelf">
        <div className="shelfHead"><div><h2>Cabernet Franc</h2><p>Elegância e frescor em uma das uvas mais queridas.</p></div><a href="/loja?uva=Cabernet%20Franc">Ver tudo <Icon name="chev"/></a></div>
        <ProductRail items={wines.filter(w=>w.name.toLowerCase().includes("cabernet franc"))}/>
      </section>

      <section className="benefitGrid">
        <div><b>Curadoria especializada</b><span>Rótulos escolhidos com critério.</span></div>
        <div><b>Compra simples</b><span>Escolha, adicione e finalize pelo atendimento.</span></div>
        <div><b>Atendimento humano</b><span>Ajuda para encontrar o vinho ideal.</span></div>
      </section>

      <section className="shelf" id="vinhos">
        <div className="shelfHead"><div><h2>Mais procurados</h2><p>Os rótulos que estão chamando mais atenção.</p></div><a href="/loja">Ver tudo <Icon name="chev"/></a></div>
        <ProductRail items={wines.slice().reverse()}/>
      </section>

      <section className="grapeSection grapeSectionFinal" id="uvas">
        <div className="shelfHead"><div><p className="sectionKicker">DESCUBRA PELO PERFIL</p><h2>EXPLORE POR UVAS</h2><p>Arraste para navegar. Ao escolher uma uva, a loja já abre filtrada.</p></div></div>
        <div className="grapeRail">{[...grapes,...grapes].map((g,i)=><a href={`/loja?uva=${encodeURIComponent(g.name)}`} className="grapeCard" key={g.name+i}><span>UVA</span><strong>{g.name}</strong><small>{g.desc}</small><b>VER VINHOS →</b></a>)}</div>
      </section>

      <section className="newsletter">
        <div><span>VIDEIRA</span><h2>Descubra novos rótulos.</h2><p>Receba novidades, seleções e ofertas especiais.</p></div>
        <div><input placeholder="Seu melhor e-mail"/><button>Quero receber</button></div>
      </section>
    </section>

    <footer className="siteFooter">
      <div className="footerBrandBlock"><div className="footerLogo"><span className="logoMark">V</span><b>VIDEIRA</b></div><p>Vinhos & curadoria</p><small>Uma seleção pensada para descobrir, comparar e escolher melhor.</small></div>
      <div className="footerCol"><b>Menu</b><a href="/">Início</a><a href="/loja">Loja</a><a href="/#ofertas">Ofertas</a><a href="/#uvas">Uvas</a></div>
      <div className="footerCol"><b>Catálogo</b><a href="/loja?tipo=Tinto">Tintos</a><a href="/loja?tipo=Branco">Brancos</a><a href="/loja?tipo=Rosé">Rosés</a><a href="/loja?tipo=Espumante">Espumantes</a></div>
      <div className="footerCol socialCol"><b>Redes sociais</b><a href="https://instagram.com/videiravinhoteca" target="_blank"><span className="socialIcon"><InstagramIcon/></span><span>@videiravinhoteca</span></a><a href="https://wa.me/5545999056277" target="_blank"><span className="socialIcon wa"><SocialWhatsappIcon/></span><span>45 99905-6277</span></a></div>
      <div className="footerBottom"><span>© 2026 Videira Vinhoteca</span><span>Venda proibida para menores de 18 anos.</span></div>
    </footer>
    <a className="whatsapp" href="https://wa.me/5545999056277" target="_blank" aria-label="WhatsApp"><WhatsappIcon/></a>
  </main>
}
