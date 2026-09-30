"use client";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Tab="produtos"|"categorias"|"bodegas"|"uvas"|"menu"|"site";
const usernameEmail:Record<string,string>={guilhsxzd:"luxstreambr@gmail.com"};

export default function Admin(){
  const [ready,setReady]=useState(false),[logged,setLogged]=useState(false),[error,setError]=useState("");
  const [tab,setTab]=useState<Tab>("produtos"),[rows,setRows]=useState<any[]>([]),[editing,setEditing]=useState<any>(null);
  const [settings,setSettings]=useState<any>(null),[saving,setSaving]=useState(false);

  useEffect(()=>{(async()=>{const {data}=await supabase.auth.getSession();if(data.session){const {data:a}=await supabase.from("admins").select("user_id").eq("user_id",data.session.user.id).maybeSingle();setLogged(!!a)}setReady(true)})()},[]);

  async function login(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setError("");
    const fd=new FormData(e.currentTarget), user=String(fd.get("user")||"").trim().toLowerCase(), password=String(fd.get("password")||"");
    const email=usernameEmail[user]; if(!email){setError("Usuário inválido.");return}
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error||!data.user){setError("Usuário ou senha incorretos.");return}
    const {data:a}=await supabase.from("admins").select("user_id").eq("user_id",data.user.id).maybeSingle();
    if(!a){await supabase.auth.signOut();setError("Esta conta não possui acesso administrativo.");return}
    setLogged(true);
  }

  const tableFor=(t:Tab)=>({produtos:"wines",categorias:"wine_types_catalog",bodegas:"bodegas",uvas:"grapes_catalog",menu:"menu_items",site:"site_settings"}[t]);

  async function load(t:Tab){
    if(t==="site"){const {data}=await supabase.from("site_settings").select("*").eq("id",1).single();setSettings(data);return}
    const {data}=await supabase.from(tableFor(t)).select("*").order("sort_order",{ascending:true});setRows(data||[]);
  }
  useEffect(()=>{if(logged)load(tab)},[logged,tab]);

  async function saveRow(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setSaving(true);
    const fd=new FormData(e.currentTarget), obj:any=Object.fromEntries(fd.entries());
    ["price","old_price","vintage","sort_order","stock"].forEach(k=>{if(k in obj)obj[k]=obj[k]===""?null:Number(obj[k])});
    if("active" in obj)obj.active=fd.get("active")==="on";
    if(tab==="produtos" && typeof obj.grapes==="string") obj.grapes=String(obj.grapes).split(",").map(x=>x.trim()).filter(Boolean);
    const table=tableFor(tab); let err;
    if(editing?.id){({error:err}=await supabase.from(table).update(obj).eq("id",editing.id))}
    else {({error:err}=await supabase.from(table).insert(obj))}
    setSaving(false); if(err){alert(err.message);return} setEditing(null);await load(tab);
  }
  async function del(id:any){if(!confirm("Excluir este item?"))return;const {error}=await supabase.from(tableFor(tab)).delete().eq("id",id);if(error)alert(error.message);else load(tab)}
  async function saveSettings(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setSaving(true);const obj:any=Object.fromEntries(new FormData(e.currentTarget).entries());
    const {error}=await supabase.from("site_settings").update(obj).eq("id",1);setSaving(false);if(error)alert(error.message);else{alert("Configurações salvas.");load("site")}
  }
  if(!ready)return null;
  if(!logged)return <main className="adminLogin"><form onSubmit={login}><span className="logoMark">V</span><h1>Painel Videira</h1><p>Acesso administrativo</p><label>Usuário<input name="user" defaultValue="guilhsxzd" autoComplete="username"/></label><label>Senha<input name="password" type="password" autoComplete="current-password"/></label>{error&&<div className="loginError">{error}</div>}<button>Entrar</button><small>O painel não possui link no site público.</small></form></main>;

  return <main className="adminShell">
    <aside className="adminSide"><div className="adminBrand"><span className="logoMark">V</span><b>VIDEIRA</b><small>ADMIN</small></div>{(["produtos","categorias","bodegas","uvas","menu","site"] as Tab[]).map(t=><button key={t} className={tab===t?"active":""} onClick={()=>{setTab(t);setEditing(null)}}>{t==="site"?"Site & identidade":t[0].toUpperCase()+t.slice(1)}</button>)}<button onClick={async()=>{await supabase.auth.signOut();location.reload()}}>Sair</button></aside>
    <section className="adminMain"><div className="adminTop"><div><small>PAINEL DE CONTROLE</small><h1>{tab==="site"?"Site & identidade":tab[0].toUpperCase()+tab.slice(1)}</h1></div>{tab!=="site"&&<button onClick={()=>setEditing({active:true,sort_order:0})}>+ Novo</button>}</div>
    {tab==="site" && settings ? <form className="adminForm settingsForm" onSubmit={saveSettings}>
      <label>Nome da loja<input name="store_name" defaultValue={settings.store_name||""}/></label>
      <label>Logo URL<input name="logo_url" defaultValue={settings.logo_url||""}/></label>
      <label>Cor principal<input name="color_primary" type="color" defaultValue={settings.color_primary||"#7a2030"}/></label>
      <label>Cor secundária<input name="color_secondary" type="color" defaultValue={settings.color_secondary||"#5a1f2a"}/></label>
      <label>WhatsApp<input name="whatsapp" defaultValue={settings.whatsapp||"5545999056277"}/></label>
      <label>Instagram<input name="instagram" defaultValue={settings.instagram||"@videiravinhoteca"}/></label>
      <label className="wide">Título principal<input name="hero_title" defaultValue={settings.hero_title||""}/></label>
      <label className="wide">Texto principal<textarea name="hero_text" defaultValue={settings.hero_text||""}/></label>
      <label className="wide">Texto do rodapé<input name="footer_text" defaultValue={settings.footer_text||""}/></label>
      <button disabled={saving}>{saving?"Salvando...":"Salvar alterações"}</button>
    </form> : <>
      <div className="adminTable">{rows.map(r=><div className="adminRow" key={r.id}><div><b>{r.name||r.label||r.slug||"Item"}</b><small>{r.winery||r.country||r.url||r.type||""}</small></div><span>{r.active===false?"Oculto":"Ativo"}</span><div><button onClick={()=>setEditing(r)}>Editar</button><button className="danger" onClick={()=>del(r.id)}>Excluir</button></div></div>)}</div>
      {editing&&<div className="adminModal"><form className="adminForm" onSubmit={saveRow}><div className="modalHead"><h2>{editing.id?"Editar":"Novo"} {tab}</h2><button type="button" onClick={()=>setEditing(null)}>×</button></div>
        {tab==="produtos"?<>
          <label>Nome<input name="name" defaultValue={editing.name||""} required/></label><label>Slug<input name="slug" defaultValue={editing.slug||""} required/></label><label>Bodega<input name="winery" defaultValue={editing.winery||""}/></label><label>Tipo<input name="type" defaultValue={editing.type||"Tinto"}/></label><label>País<input name="country" defaultValue={editing.country||""}/></label><label>Região<input name="region" defaultValue={editing.region||""}/></label><label>Uvas<input name="grapes" defaultValue={(editing.grapes||[]).join(", ")}/></label><label>Safra<input name="vintage" type="number" defaultValue={editing.vintage||""}/></label><label>Preço<input name="price" type="number" step="0.01" defaultValue={editing.price||""}/></label><label>Preço anterior<input name="old_price" type="number" step="0.01" defaultValue={editing.old_price||""}/></label><label>Estoque<input name="stock" type="number" defaultValue={editing.stock||0}/></label><label>Imagem URL<input name="image_url" defaultValue={editing.image_url||""}/></label>
        </>:tab==="menu"?<><label>Texto<input name="label" defaultValue={editing.label||""} required/></label><label>URL<input name="url" defaultValue={editing.url||"/"} required/></label><label>Local<select name="location" defaultValue={editing.location||"header"}><option value="header">Header</option><option value="footer">Footer</option></select></label></>:<>
          <label>Nome<input name="name" defaultValue={editing.name||""} required/></label><label>Descrição<textarea name="description" defaultValue={editing.description||""}/></label>{tab==="bodegas"&&<><label>País<input name="country" defaultValue={editing.country||""}/></label><label>Região<input name="region" defaultValue={editing.region||""}/></label></>}
        </>}
        <label>Ordem<input name="sort_order" type="number" defaultValue={editing.sort_order||0}/></label><label className="check"><input name="active" type="checkbox" defaultChecked={editing.active!==false}/> Ativo</label><button disabled={saving}>{saving?"Salvando...":"Salvar"}</button>
      </form></div>}
    </>}</section>
  </main>
}
