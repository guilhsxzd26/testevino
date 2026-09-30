"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const wines = [
  { name:"Gran Reserva Malbec", producer:"Bodega Altura", origin:"Mendoza, Argentina", type:"Tinto", price:"R$ 189,90", image:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=86", badge:"Destaque" },
  { name:"Pinot Noir de Parcela", producer:"Casa del Valle", origin:"Patagônia, Argentina", type:"Tinto", price:"R$ 219,00", image:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=86", badge:"Sommelier" },
  { name:"Sauvignon Blanc Reserva", producer:"Viña Costera", origin:"Casablanca, Chile", type:"Branco", price:"R$ 139,90", image:"https://images.unsplash.com/photo-1566995541428-f2246c17cda1?auto=format&fit=crop&w=900&q=86", badge:"Novo" },
  { name:"Rosé de Provence", producer:"Maison Éloise", origin:"Provence, França", type:"Rosé", price:"R$ 169,00", image:"https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=900&q=86", badge:"Seleção" }
];

const countries = [
  {name:"Argentina", meta:"Mendoza · Salta · Patagônia"},
  {name:"Chile", meta:"Maipo · Colchagua · Casablanca"},
  {name:"Itália", meta:"Toscana · Piemonte · Veneto"},
  {name:"França", meta:"Bordeaux · Rhône · Provence"}
];

function Icon({ name }: { name: "search"|"bag"|"store"|"menu"|"arrow"|"heart" }) {
  const paths = {
    search:<><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></>,
    bag:<><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    store:<><path d="M4 9h16l-1.5-5h-13L4 9Z"/><path d="M6 10v10h12V10"/><path d="M9 20v-6h6v6"/></>,
    menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>,
    arrow:<path d="M5 12h14m-5-5 5 5-5 5"/>,
    heart:<path d="M20 8.6c0 5-8 10.4-8 10.4S4 13.6 4 8.6A4.6 4.6 0 0 1 12 5a4.6 4.6 0 0 1 8 3.6Z"/>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">{paths[name]}</svg>;
}

export default function Home() {
  const [menuOpen,setMenuOpen] = useState(false);
  const [searchOpen,setSearchOpen] = useState(false);
  const [adult,setAdult] = useState(true);
  const [query,setQuery] = useState("");

  useEffect(() => {
    setAdult(localStorage.getItem("videira-age") === "ok");
  },[]);

  const filtered = useMemo(() => wines.filter(w => `${w.name} ${w.producer} ${w.origin} ${w.type}`.toLowerCase().includes(query.toLowerCase())),[query]);

  const confirmAge = () => {
    localStorage.setItem("videira-age","ok");
    setAdult(true);
  };

  return (
    <main>
      {!adult && (
        <div className="ageGate">
          <div className="agePanel">
            <div className="ageMark">V</div>
            <p className="eyebrow">BEM-VINDO À VIDEIRA</p>
            <h1>Vinho é feito de tempo.<br/>A experiência também.</h1>
            <p>Para continuar, confirme que você tem 18 anos ou mais.</p>
            <button onClick={confirmAge}>Tenho 18 anos ou mais</button>
            <small>Beba com moderação. A venda de bebidas alcoólicas é proibida para menores de 18 anos.</small>
          </div>
        </div>
      )}

      <div className="utilityBar">
        <span>Curadoria especial · atendimento personalizado</span>
        <div><a href="#catalogo">Catálogo</a><a href="#contato">Fale conosco</a></div>
      </div>

      <header className="siteHeader">
        <div className="headerInner">
          <button className="mobileIcon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu"><Icon name="menu"/></button>
          <a className="brand" href="#"><span className="brandLeaf">V</span><span>VIDEIRA</span><small>VINHOS & CURADORIA</small></a>
          <nav className={menuOpen ? "nav open" : "nav"}>
            <a href="#bodegas">BODEGAS</a>
            <a href="#uvas">UVAS</a>
            <a href="#tipos">TIPO DE VINHO</a>
          </nav>
          <div className="headerActions">
            <button onClick={() => setSearchOpen(true)} aria-label="Pesquisar"><Icon name="search"/></button>
            <button aria-label="Carrinho"><Icon name="bag"/><span className="cartCount">0</span></button>
            <a className="storeLink" href="#catalogo"><Icon name="store"/><span>LOJA</span></a>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="searchLayer">
          <button className="closeSearch" onClick={() => setSearchOpen(false)}>×</button>
          <div className="searchContent">
            <p className="eyebrow">ENCONTRE SEU VINHO</p>
            <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Busque por vinho, bodega, uva ou região"/>
            <div className="searchResults">
              {(query ? filtered : wines.slice(0,3)).map(w => (
                <a key={w.name} href="#catalogo" onClick={()=>setSearchOpen(false)}>
                  <span>{w.name}<small>{w.producer} · {w.origin}</small></span><b>{w.price}</b>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="hero">
        <div className="heroTexture"/>
        <div className="heroCopy">
          <p className="eyebrow light">CURADORIA VIDEIRA · EDIÇÃO 01</p>
          <h1>Vinhos que contam<br/>de onde vieram.</h1>
          <p>Uma seleção feita para quem procura origem, personalidade e uma boa história em cada garrafa.</p>
          <a className="primaryCta" href="#catalogo">EXPLORAR SELEÇÃO <Icon name="arrow"/></a>
        </div>
        <div className="heroVisual" aria-hidden="true">
          <div className="halo"/>
          <div className="bottle bottleBack"><span>V</span></div>
          <div className="bottle bottleFront"><span className="bottleLabel"><b>VIDEIRA</b><i>Reserva</i><small>Malbec · 2022</small></span></div>
          <div className="heroSeal"><strong>01</strong><span>SELEÇÃO<br/>DA CASA</span></div>
        </div>
        <div className="heroFoot"><span>01 / 03</span><div className="line"/><span>MENDOZA · ARGENTINA</span></div>
      </section>

      <section className="intro">
        <p className="eyebrow">NOSSA CURADORIA</p>
        <div className="introGrid">
          <h2>Menos rótulos por acaso.<br/><em>Mais escolhas com sentido.</em></h2>
          <p>Selecionamos vinhos por origem, produtor e expressão. Do clássico ao novo, cada garrafa entra no catálogo por um motivo.</p>
        </div>
      </section>

      <section className="wineSection" id="catalogo">
        <div className="sectionHead">
          <div><p className="eyebrow">DESTAQUES</p><h2>Escolhas da semana</h2></div>
          <a href="#">VER TODOS <Icon name="arrow"/></a>
        </div>
        <div className="wineGrid">
          {wines.map((wine, i) => (
            <article className="wineCard" key={wine.name}>
              <div className="wineImage">
                <Image src={wine.image} alt={wine.name} fill sizes="(max-width: 800px) 80vw, 25vw" priority={i<2}/>
                <span className="badge">{wine.badge}</span>
                <button className="heart" aria-label="Favoritar"><Icon name="heart"/></button>
              </div>
              <div className="wineMeta">
                <p>{wine.producer}</p>
                <h3>{wine.name}</h3>
                <span>{wine.origin} · {wine.type}</span>
                <div><b>{wine.price}</b><button>ADICIONAR</button></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="discovery" id="tipos">
        <div className="discoveryCopy">
          <p className="eyebrow light">DESCUBRA POR ESTILO</p>
          <h2>Qual vinho combina<br/>com o seu momento?</h2>
          <p>Explore a seleção a partir do que você quer sentir na taça.</p>
        </div>
        <div className="styleList">
          {["Tintos intensos","Brancos frescos","Rosés delicados","Espumantes"].map((item,i)=>(
            <a href="#" key={item}><span>0{i+1}</span><strong>{item}</strong><Icon name="arrow"/></a>
          ))}
        </div>
      </section>

      <section className="origins" id="bodegas">
        <div className="sectionHead">
          <div><p className="eyebrow">ORIGENS</p><h2>Viaje pela taça</h2></div>
        </div>
        <div className="countryGrid">
          {countries.map((c,i)=>(
            <a href="#" className="countryCard" key={c.name}>
              <span>0{i+1}</span><h3>{c.name}</h3><p>{c.meta}</p><Icon name="arrow"/>
            </a>
          ))}
        </div>
      </section>

      <section className="grapes" id="uvas">
        <div className="grapeVisual"><span className="grapeCluster">●<br/>● ●<br/>● ● ●<br/> ● ●<br/> ●</span></div>
        <div className="grapeCopy">
          <p className="eyebrow">GUIA DE UVAS</p>
          <h2>Conheça o vinho<br/>pela sua essência.</h2>
          <p>Malbec, Cabernet Sauvignon, Chardonnay, Pinot Noir e muitas outras. Entenda perfis, aromas e combinações.</p>
          <a className="textCta" href="#">EXPLORAR UVAS <Icon name="arrow"/></a>
        </div>
      </section>

      <footer id="contato">
        <div className="footerBrand"><span className="brandLeaf">V</span><b>VIDEIRA</b><p>Vinhos escolhidos para serem lembrados.</p></div>
        <div><h4>EXPLORAR</h4><a href="#catalogo">Catálogo</a><a href="#bodegas">Bodegas</a><a href="#uvas">Uvas</a></div>
        <div><h4>ATENDIMENTO</h4><a href="#">WhatsApp</a><a href="#">Instagram</a><a href="#">Dúvidas frequentes</a></div>
        <div><h4>NEWSLETTER</h4><p>Receba novidades e seleções especiais.</p><div className="newsletter"><input placeholder="Seu e-mail"/><button>→</button></div></div>
        <small>© 2026 Videira. Venda proibida para menores de 18 anos.</small>
      </footer>

      <a className="whatsapp" href="https://wa.me/" aria-label="WhatsApp">WA</a>
    </main>
  );
}