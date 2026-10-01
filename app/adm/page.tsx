"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminMediaUpload from "@/components/AdminMediaUpload";

type Tab="produtos"|"categorias"|"bodegas"|"uvas"|"menu"|"construtor"|"site";

const labels:Record<Tab,string>={
  produtos:"Produtos",categorias:"Categorias",bodegas:"Bodegas",uvas:"Uvas",menu:"Menu",
  construtor:"Construtor da Home",site:"Site & identidade"
};

export default function Admin(){
  const [tab,setTab]=useState<Tab>("produtos");
  const [rows,setRows]=useState<any[]>([]);
  const [editing,setEditing]=useState<any>(null);
  const [settings,setSettings]=useState<any>(null);
  const [saving,setSaving]=useState(false);
  const [search,setSearch]=useState("");

  const tableFor=(t:Tab)=>({
    produtos:"wines",categorias:"wine_types_catalog",bodegas:"bodegas",uvas:"grapes_catalog",
    menu:"menu_items",construtor:"content_sections",site:"site_settings"
  }[t]);

  async function load(t:Tab){
    setSearch("");
    if(t==="site"){
      const {data}=await supabase.from("site_settings").select("*").eq("id",1).single();
      setSettings(data);
      return;
    }
    let q=supabase.from(tableFor(t)).select("*").order("sort_order",{ascending:true});
    if(t==="construtor") q=q.eq("page","home");
    const {data,error}=await q;
    if(error)alert(error.message);
    setRows(data||[]);
  }

  useEffect(()=>{load(tab)},[tab]);

  const visibleRows=useMemo(()=>{
    const q=search.trim().toLowerCase();
    if(!q)return rows;
    return rows.filter(r=>[
      r.name,r.label,r.title,r.subtitle,r.winery,r.country,r.region,r.type,r.slug,r.url,
      ...(Array.isArray(r.grapes)?r.grapes:[])
    ].filter(Boolean).join(" ").toLowerCase().includes(q));
  },[rows,search]);

  async function saveRow(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setSaving(true);
    const fd=new FormData(e.currentTarget);
    const obj:any=Object.fromEntries(fd.entries());

    ["price","old_price","vintage","sort_order","stock","alcohol","volume_ml","rating","review_count","discount_pct"].forEach(k=>{
      if(k in obj)obj[k]=obj[k]===""?null:Number(obj[k]);
    });

    obj.active=fd.get("active")==="on";
    if(tab==="produtos"){
      obj.grapes=String(obj.grapes||"").split(",").map(x=>x.trim()).filter(Boolean);
      obj.aromas=String(obj.aromas||"").split(",").map(x=>x.trim()).filter(Boolean);
      obj.pairings=String(obj.pairings||"").split(",").map(x=>x.trim()).filter(Boolean);
      obj.featured=fd.get("featured")==="on";
      obj.new_arrival=fd.get("new_arrival")==="on";
      obj.available=fd.get("available")==="on";
    }
    if(tab==="construtor"){
      obj.page="home";
      obj.section_key=obj.section_key||("section-"+Date.now());
      obj.data={
        template:obj.template||"product_rail",
        filter:obj.filter||"all",
        filter_value:obj.filter_value||"",
        limit:Number(obj.limit)||15
      };
      delete obj.template; delete obj.filter; delete obj.filter_value; delete obj.limit;
    }

    const table=tableFor(tab);
    const result=editing?.id
      ? await supabase.from(table).update(obj).eq("id",editing.id)
      : await supabase.from(table).insert(obj);

    setSaving(false);
    if(result.error){alert(result.error.message);return}
    setEditing(null);
    await load(tab);
  }

  async function del(id:any){
    if(!confirm("Excluir este item?"))return;
    const {error}=await supabase.from(tableFor(tab)).delete().eq("id",id);
    if(error)alert(error.message); else load(tab);
  }

  async function move(row:any,dir:-1|1){
    const index=rows.findIndex(r=>r.id===row.id);
    const other=rows[index+dir];
    if(!other)return;
    const a=row.sort_order??index*10,b=other.sort_order??(index+dir)*10;
    await Promise.all([
      supabase.from(tableFor(tab)).update({sort_order:b}).eq("id",row.id),
      supabase.from(tableFor(tab)).update({sort_order:a}).eq("id",other.id)
    ]);
    load(tab);
  }

  async function toggle(row:any){
    await supabase.from(tableFor(tab)).update({active:row.active===false?true:false}).eq("id",row.id);
    load(tab);
  }

  async function saveSettings(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setSaving(true);
    const obj:any=Object.fromEntries(new FormData(e.currentTarget).entries());
    obj.logo_url=settings?.logo_url||null;
    obj.favicon_url=settings?.favicon_url||null;
    const {error}=await supabase.from("site_settings").update(obj).eq("id",1);
    setSaving(false);
    if(error)alert(error.message); else {alert("Configurações salvas.");load("site")}
  }

  const newRow=()=>{
    if(tab==="construtor") setEditing({active:true,sort_order:(rows.at(-1)?.sort_order||0)+10,data:{template:"product_rail",filter:"all",limit:15}});
    else setEditing({active:true,available:true,sort_order:(rows.at(-1)?.sort_order||0)+10});
  };

  return <main className="adminShell">
    <aside className="adminSide">
      <div className="adminBrand"><span className="logoMark">V</span><b>VIDEIRA</b><small>ADMIN</small></div>
      {(Object.keys(labels) as Tab[]).map(t=><button key={t} className={tab===t?"active":""} onClick={()=>{setTab(t);setEditing(null)}}>{labels[t]}</button>)}
    </aside>

    <section className="adminMain">
      <div className="adminTop">
        <div><small>PAINEL DE CONTROLE</small><h1>{labels[tab]}</h1></div>
        {tab!=="site"&&<button onClick={newRow}>+ Novo</button>}
      </div>

      {tab==="site"&&settings ? <form className="adminForm settingsForm" onSubmit={saveSettings}>
        <div className="wide adminSectionTitle"><h2>Identidade visual</h2><p>Arquivos e aparência principal da Videira.</p></div>

        <AdminMediaUpload label="Logo do site" value={settings.logo_url} onChange={url=>setSettings({...settings,logo_url:url})}/>
        <AdminMediaUpload label="Favicon" value={settings.favicon_url} folder="favicon" accept="image/png,image/x-icon,image/svg+xml" onChange={url=>setSettings({...settings,favicon_url:url})}/>

        <label>Nome da loja<input name="store_name" defaultValue={settings.store_name||""}/></label>
        <label>WhatsApp<input name="whatsapp" defaultValue={settings.whatsapp||""}/></label>
        <label>Instagram<input name="instagram" defaultValue={settings.instagram||""}/></label>
        <label>Cor principal<input name="color_primary" type="color" defaultValue={settings.color_primary||"#780148"}/></label>
        <label>Cor secundária<input name="color_secondary" type="color" defaultValue={settings.color_secondary||"#4D0830"}/></label>
        <label>Cor de fundo<input name="color_background" type="color" defaultValue={settings.color_background||"#FFF5E1"}/></label>
        <label>Cor de destaque<input name="color_accent" type="color" defaultValue={settings.color_accent||"#25D366"}/></label>
        <label className="wide">Título principal<input name="hero_title" defaultValue={settings.hero_title||""}/></label>
        <label className="wide">Texto principal<textarea name="hero_text" defaultValue={settings.hero_text||""}/></label>
        <label className="wide">Texto do rodapé<input name="footer_text" defaultValue={settings.footer_text||""}/></label>
        <button disabled={saving}>{saving?"Salvando...":"Salvar alterações"}</button>
      </form> : <>

        <div className="adminToolbar">
          <div className="adminSearch"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={"Pesquisar em "+labels[tab].toLowerCase()+"..."}/></div>
          <span>{visibleRows.length} item(ns)</span>
        </div>

        {tab==="construtor"&&<div className="builderIntro">
          <div><b>Construtor da Home</b><p>Organize, ative, desative e edite as seções públicas sem alterar código.</p></div>
          <div className="templateLegend"><span>Produtos</span><span>Uvas</span><span>Banner</span><span>Texto</span><span>Benefícios</span><span>Newsletter</span></div>
        </div>}

        <div className={tab==="construtor"?"adminTable builderTable":"adminTable"}>
          {visibleRows.map((r,index)=><div className={tab==="construtor"?"adminRow builderRow":"adminRow"} key={r.id}>
            <div>
              <b>{r.name||r.label||r.title||r.slug||"Item"}</b>
              <small>{tab==="construtor"?(r.data?.template||"seção"):(r.winery||r.country||r.url||r.type||"")}</small>
            </div>
            <span className={r.active===false?"statusOff":"statusOn"}>{r.active===false?"Oculto":"Ativo"}</span>
            <div className="adminActions">
              {tab==="construtor"&&<><button onClick={()=>move(r,-1)} disabled={index===0}>↑</button><button onClick={()=>move(r,1)} disabled={index===visibleRows.length-1}>↓</button><button onClick={()=>toggle(r)}>{r.active===false?"Ativar":"Ocultar"}</button></>}
              <button onClick={()=>setEditing(r)}>Editar</button>
              <button className="danger" onClick={()=>del(r.id)}>Excluir</button>
            </div>
          </div>)}
        </div>

        {editing&&<div className="adminModal"><form className="adminForm" onSubmit={saveRow}>
          <div className="modalHead"><h2>{editing.id?"Editar":"Novo"} {labels[tab]}</h2><button type="button" onClick={()=>setEditing(null)}>×</button></div>

          {tab==="produtos"?<>
            <label>Nome<input name="name" defaultValue={editing.name||""} required/></label>
            <label>Slug<input name="slug" defaultValue={editing.slug||""} required/></label>
            <label>Bodega<input name="winery" defaultValue={editing.winery||""}/></label>
            <label>Tipo<input name="type" defaultValue={editing.type||"Tinto"}/></label>
            <label>País<input name="country" defaultValue={editing.country||""}/></label>
            <label>Região<input name="region" defaultValue={editing.region||""}/></label>
            <label>Uvas<input name="grapes" defaultValue={(editing.grapes||[]).join(", ")}/></label>
            <label>Safra<input name="vintage" type="number" defaultValue={editing.vintage||""}/></label>
            <label>Preço<input name="price" type="number" step="0.01" defaultValue={editing.price||""}/></label>
            <label>Preço anterior<input name="old_price" type="number" step="0.01" defaultValue={editing.old_price||""}/></label>
            <label>Estoque<input name="stock" type="number" defaultValue={editing.stock||0}/></label>
            <label>Álcool %<input name="alcohol" type="number" step="0.1" defaultValue={editing.alcohol||""}/></label>
            <label>Volume ml<input name="volume_ml" type="number" defaultValue={editing.volume_ml||750}/></label>
            <label>Avaliação<input name="rating" type="number" step="0.1" defaultValue={editing.rating||4.3}/></label>
            <label>Avaliações qtd.<input name="review_count" type="number" defaultValue={editing.review_count||0}/></label>
            <label>Desconto %<input name="discount_pct" type="number" defaultValue={editing.discount_pct||0}/></label>
            <label className="wide">Aromas<input name="aromas" defaultValue={(editing.aromas||[]).join(", ")} placeholder="Frutas vermelhas, baunilha, especiarias"/></label>
            <label className="wide">Harmonizações<input name="pairings" defaultValue={(editing.pairings||[]).join(", ")} placeholder="Carnes, massas, queijos"/></label>
            <label className="wide">Notas de degustação<textarea name="tasting_notes" defaultValue={editing.tasting_notes||""}/></label>
            <label className="wide">Descrição<textarea name="description" defaultValue={editing.description||""}/></label>
            <AdminMediaUpload label="Imagem do produto" bucket="wine-images" folder="products" value={editing.image_url} onChange={url=>setEditing({...editing,image_url:url})}/>
            <input type="hidden" name="image_url" value={editing.image_url||""}/>
            <label className="check"><input name="available" type="checkbox" defaultChecked={editing.available!==false}/> Disponível</label>
            <label className="check"><input name="featured" type="checkbox" defaultChecked={!!editing.featured}/> Destaque</label>
            <label className="check"><input name="new_arrival" type="checkbox" defaultChecked={!!editing.new_arrival}/> Novidade</label>
          </>:tab==="construtor"?<>
            <label>Nome interno<input name="section_key" defaultValue={editing.section_key||""} placeholder="ex: home-malbec"/></label>
            <label>Título<input name="title" defaultValue={editing.title||""}/></label>
            <label>Subtítulo<input name="subtitle" defaultValue={editing.subtitle||""}/></label>
            <label>Template<select name="template" defaultValue={editing.data?.template||"product_rail"}><option value="product_rail">Carrossel de produtos</option><option value="grape_rail">Carrossel de uvas</option><option value="banner">Banner</option><option value="text">Texto</option><option value="benefits">Benefícios</option><option value="newsletter">Newsletter</option></select></label>
            <label>Filtro<select name="filter" defaultValue={editing.data?.filter||"all"}><option value="all">Todos</option><option value="featured">Destaques</option><option value="new_arrival">Novidades</option><option value="grape">Uva</option><option value="type">Tipo</option><option value="winery">Bodega</option></select></label>
            <label>Valor do filtro<input name="filter_value" defaultValue={editing.data?.filter_value||""} placeholder="Ex: Malbec"/></label>
            <label>Máximo de produtos<input name="limit" type="number" min="1" max="15" defaultValue={editing.data?.limit||15}/></label>
            <label>Botão<input name="button_label" defaultValue={editing.button_label||""}/></label>
            <label>URL do botão<input name="button_url" defaultValue={editing.button_url||""}/></label>
            <label className="wide">Texto<textarea name="body" defaultValue={editing.body||""}/></label>
            <AdminMediaUpload label="Imagem / banner" value={editing.image_url} folder="sections" onChange={url=>setEditing({...editing,image_url:url})}/>
            <input type="hidden" name="image_url" value={editing.image_url||""}/>
          </>:tab==="menu"?<>
            <label>Texto<input name="label" defaultValue={editing.label||""} required/></label>
            <label>URL<input name="url" defaultValue={editing.url||"/"} required/></label>
            <label>Local<select name="location" defaultValue={editing.location||"header"}><option value="header">Header</option><option value="footer">Footer</option></select></label>
          </>:<>
            <label>Nome<input name="name" defaultValue={editing.name||""} required/></label>
            <label className="wide">Descrição<textarea name="description" defaultValue={editing.description||""}/></label>
            {tab==="bodegas"&&<><label>País<input name="country" defaultValue={editing.country||""}/></label><label>Região<input name="region" defaultValue={editing.region||""}/></label></>}
          </>}

          <label>Ordem<input name="sort_order" type="number" defaultValue={editing.sort_order||0}/></label>
          <label className="check"><input name="active" type="checkbox" defaultChecked={editing.active!==false}/> Ativo</label>
          <button className="wide" disabled={saving}>{saving?"Salvando...":"Salvar"}</button>
        </form></div>}
      </>}
    </section>
  </main>
}
