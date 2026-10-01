"use client";

import { useEffect, useState } from "react";
import ProductRail, { RailWine } from "@/components/ProductRail";
import { supabase } from "@/lib/supabase";
import DraggableRail from "@/components/DraggableRail";

type Section={
  id:string;
  title:string|null;
  subtitle:string|null;
  body:string|null;
  image_url:string|null;
  button_label:string|null;
  button_url:string|null;
  data:any;
  sort_order:number;
};

type WineRow={
  id:string;
  name:string;
  winery:string|null;
  type:string;
  country:string|null;
  grapes:string[];
  vintage:number|null;
  price:number|null;
  old_price:number|null;
  rating:number|null;
  review_count:number|null;
  discount_pct:number|null;
  image_url:string|null;
  featured:boolean;
  new_arrival:boolean;
};

type Grape={id:string;name:string;description:string|null};

const fallback="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=85";

function brl(n:number|null){
  return n==null?"Sob consulta":n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function toRail(w:WineRow):RailWine{
  return {
    id:w.id,
    name:w.name,
    winery:w.winery||"Videira",
    year:w.vintage||"",
    rating:String(w.rating??4.3).replace(".",","),
    reviews:String(w.review_count??0),
    old:w.old_price?brl(w.old_price):"",
    price:w.price?brl(w.price):"Sob consulta",
    discount:w.discount_pct?"-"+w.discount_pct+"%":"",
    country:w.country||"",
    type:w.type,
    image:w.image_url||fallback
  };
}

export default function DynamicHomeSections(){
  const [sections,setSections]=useState<Section[]>([]);
  const [wines,setWines]=useState<WineRow[]>([]);
  const [grapes,setGrapes]=useState<Grape[]>([]);

  useEffect(()=>{
    (async()=>{
      const results=await Promise.all([
        supabase.from("content_sections").select("*").eq("page","home").eq("active",true).order("sort_order"),
        supabase.from("wines").select("*").eq("active",true).order("sort_order"),
        supabase.from("grapes_catalog").select("*").eq("active",true).order("sort_order")
      ]);
      setSections((results[0].data||[]).filter((x:any)=>x?.data?.template));
      setWines(results[1].data||[]);
      setGrapes(results[2].data||[]);
    })();
  },[]);

  const selectWines=(s:Section)=>{
    const filter=s.data?.filter||"all";
    const value=String(s.data?.filter_value||"");
    let list=[...wines];
    if(filter==="featured")list=list.filter(w=>w.featured);
    if(filter==="new_arrival")list=list.filter(w=>w.new_arrival);
    if(filter==="grape")list=list.filter(w=>(w.grapes||[]).some(g=>g.toLowerCase()===value.toLowerCase()));
    if(filter==="type")list=list.filter(w=>w.type.toLowerCase()===value.toLowerCase());
    if(filter==="winery")list=list.filter(w=>(w.winery||"").toLowerCase()===value.toLowerCase());
    return list.slice(0,Math.min(Number(s.data?.limit)||15,15)).map(toRail);
  };

  if(!sections.length)return null;

  return <div className="builderSections">
    {sections.map(section=>{
      const template=section.data?.template;

      if(template==="product_rail"){
        const items=selectWines(section);
        if(!items.length)return null;
        return <section className="shelf" key={section.id}>
          <div className="shelfHead">
            <div>
              {section.subtitle&&<p className="sectionKicker">{section.subtitle}</p>}
              <h2>{section.title}</h2>
              {section.body&&<p>{section.body}</p>}
            </div>
            <a href={section.button_url||"/loja"}>{section.button_label||"Ver tudo"} →</a>
          </div>
          <ProductRail items={items}/>
        </section>
      }

      if(template==="grape_rail"){
        return <section className="grapeSection grapeSectionFinal" key={section.id} id="uvas">
          <div className="shelfHead">
            <div>
              {section.subtitle&&<p className="sectionKicker">{section.subtitle}</p>}
              <h2>{section.title}</h2>
              {section.body&&<p>{section.body}</p>}
            </div>
          </div>
          <DraggableRail className="grapeRail">
            {[...grapes,...grapes].map((g,i)=>
              <a href={"/loja?uva="+encodeURIComponent(g.name)} className="grapeCard" key={g.id+"-"+i}>
                <span>UVA</span><strong>{g.name}</strong><small>{g.description||"Explore os rótulos dessa variedade."}</small><b>VER VINHOS →</b>
              </a>
            )}
          </DraggableRail>
        </section>
      }

      if(template==="benefits"){
        return <section className="benefitGrid" key={section.id}>
          <div><b>Curadoria especializada</b><span>Rótulos escolhidos com critério.</span></div>
          <div><b>Compra simples</b><span>Escolha, adicione e peça seu orçamento.</span></div>
          <div><b>Atendimento humano</b><span>Ajuda para encontrar o vinho ideal.</span></div>
        </section>
      }

      if(template==="newsletter"){
        return <section className="newsletter" key={section.id}>
          <div>{section.subtitle&&<span>{section.subtitle}</span>}<h2>{section.title}</h2><p>{section.body}</p></div>
          <div><input placeholder="Seu melhor e-mail"/><button>Quero receber</button></div>
        </section>
      }

      if(template==="banner"){
        const style=section.image_url?{backgroundImage:"linear-gradient(90deg,rgba(39,17,18,.82),rgba(39,17,18,.28)),url("+section.image_url+")"}:{};
        return <section className="builderBanner" key={section.id} style={style}>
          <div>{section.subtitle&&<span>{section.subtitle}</span>}<h2>{section.title}</h2><p>{section.body}</p>{section.button_label&&<a href={section.button_url||"/loja"}>{section.button_label}</a>}</div>
        </section>
      }

      if(template==="text"){
        return <section className="builderText" key={section.id}>
          {section.subtitle&&<span>{section.subtitle}</span>}<h2>{section.title}</h2><p>{section.body}</p>
        </section>
      }

      return null;
    })}
  </div>
}
