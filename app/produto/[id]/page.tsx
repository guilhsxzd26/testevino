"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import CartButton from "@/components/CartButton";
import ProductRail, { RailWine } from "@/components/ProductRail";
import { addToCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";

type Wine={
  id:string;name:string;slug:string;winery:string|null;type:string;price:number|null;old_price:number|null;
  grapes:string[];rating:number|null;review_count:number|null;discount_pct:number|null;region:string|null;country:string|null;
  alcohol:number|null;vintage:number|null;featured:boolean;new_arrival:boolean;aromas:string[];pairings:string[];
  image_url:string|null;volume_ml:number|null;serving_temperature:string|null;description:string|null;
  tasting_notes:string|null;body_level:string|null;acidity_level:string|null;sweetness_level:string|null;oak_level:string|null;
};

const fallback="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=85";
const brl=(n:number|null)=>n==null?"Sob consulta":n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

function toRail(w:Wine):RailWine{
  return {
    id:w.id,name:w.name,winery:w.winery||"Videira",year:w.vintage||"",
    rating:String(w.rating??4.3).replace(".",","),reviews:String(w.review_count??0),
    old:w.old_price?brl(w.old_price):"",price:brl(w.price),
    discount:w.discount_pct?"-"+w.discount_pct+"%":"",
    country:w.country||"",type:w.type,image:w.image_url||fallback
  };
}

export default function Produto(){
  const params=useParams<{id:string}>();
  const [wine,setWine]=useState<Wine|null>(null);
  const [related,setRelated]=useState<Wine[]>([]);
  const [loading,setLoading]=useState(true);
  const [added,setAdded]=useState(false);

  useEffect(()=>{
    if(!params?.id)return;
    (async()=>{
      const {data,error}=await supabase.from("wines").select("*").eq("id",params.id).maybeSingle();
      if(error){setLoading(false);return}
      setWine(data||null);
      if(data?.winery){
        const {data:r}=await supabase.from("wines").select("*").eq("active",true).eq("winery",data.winery).neq("id",data.id).order("sort_order").limit(15);
        setRelated(r||[]);
      }
      setLoading(false);
    })();
  },[params?.id]);

  const railItems=useMemo(()=>related.map(toRail),[related]);

  if(loading)return <main className="productState"><h1>Carregando vinho...</h1></main>;
  if(!wine)return <main className="productState"><h1>Vinho não encontrado</h1><a href="/loja">Voltar para a loja</a></main>;

  const add=()=>{
    addToCart({
      id:wine.id,
      name:[wine.name,wine.vintage].filter(Boolean).join(" "),
      winery:wine.winery||"Videira",
      year:wine.vintage||"",
      price:Number(wine.price)||0,
      image:wine.image_url||fallback
    });
    setAdded(true);
    setTimeout(()=>setAdded(false),1000);
  };

  const facts=[
    ["Bodega",wine.winery],
    ["Uvas",(wine.grapes||[]).join(", ")],
    ["Safra",wine.vintage],
    ["Região",[wine.region,wine.country].filter(Boolean).join(", ")],
    ["Volume",wine.volume_ml?wine.volume_ml+" ml":null],
    ["Álcool",wine.alcohol?wine.alcohol+"%":null],
    ["Serviço",wine.serving_temperature]
  ].filter(([,v])=>v);

  return <main className="productPage">
    <div className="topbar">Videira Vinhoteca · atendimento pelo WhatsApp</div>
    <header className="header">
      <div className="headerTop">
        <a href="/" className="logo"><span className="logoMark">V</span><span>VIDEIRA</span></a>
        <a className="productBack" href="/loja">← Voltar para a loja</a>
        <div className="actions"><CartButton/></div>
      </div>
    </header>

    <section className="productHero">
      <div className="productGallery">
        <div className="productImageWrap">
          <img src={wine.image_url||fallback} alt={wine.name}/>
          {wine.discount_pct?<span className="productDiscount">-{wine.discount_pct}%</span>:null}
        </div>
      </div>

      <div className="productInfo">
        <p className="productKicker">{wine.winery||"Videira"}</p>
        <h1>{wine.name} {wine.vintage||""}</h1>
        <p className="productOrigin">{[wine.region,wine.country,wine.type].filter(Boolean).join(" · ")}</p>
        <div className="productRating"><strong>{String(wine.rating??4.3).replace(".",",")}</strong><span>★★★★★</span><small>{wine.review_count??0} avaliações</small></div>

        <div className="productPrice">
          <div>{wine.old_price?<del>{brl(wine.old_price)}</del>:null}<strong>{brl(wine.price)}</strong></div>
          <button onClick={add}>{added?"Adicionado ✓":"Adicionar ao carrinho"}</button>
        </div>

        {wine.description&&<p className="productDescription">{wine.description}</p>}

        <div className="productFacts">
          {facts.map(([label,value])=><div key={String(label)}><span>{label}</span><b>{String(value)}</b></div>)}
        </div>
      </div>
    </section>

    <section className="productDetails">
      <div>
        <p className="sectionKicker">PERFIL DO VINHO</p>
        <h2>Notas & aromas</h2>
        <p>{wine.tasting_notes||"Um vinho selecionado pela Videira para entregar equilíbrio, identidade e prazer na taça."}</p>
        <div className="tagGroup">
          {(wine.aromas||[]).map(a=><span key={a}>{a}</span>)}
        </div>
      </div>
      <div>
        <p className="sectionKicker">HARMONIZAÇÃO</p>
        <h2>Combina com</h2>
        <div className="tagGroup">
          {(wine.pairings||[]).length?(wine.pairings||[]).map(p=><span key={p}>{p}</span>):<span>Consulte nossa recomendação</span>}
        </div>
      </div>
    </section>

    {railItems.length>0&&<section className="relatedSection">
      <div className="shelfHead">
        <div><p className="sectionKicker">DA MESMA BODEGA</p><h2>Mais de {wine.winery}</h2><p>Outros rótulos do mesmo produtor.</p></div>
        <a href={"/loja?bodega="+encodeURIComponent(wine.winery||"")}>Ver todos →</a>
      </div>
      <ProductRail items={railItems}/>
    </section>}
  </main>
}
