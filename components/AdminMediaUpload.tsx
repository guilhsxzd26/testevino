"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminMediaUpload({
  label,
  value,
  bucket="cms",
  folder="site",
  accept="image/*",
  onChange
}:{
  label:string;
  value?:string|null;
  bucket?:"cms"|"wine-images";
  folder?:string;
  accept?:string;
  onChange:(url:string)=>void;
}){
  const [uploading,setUploading]=useState(false);

  const upload=async(file?:File)=>{
    if(!file)return;
    setUploading(true);
    const safe=file.name.toLowerCase().replace(/[^a-z0-9._-]/g,"-");
    const path=folder+"/"+Date.now()+"-"+safe;
    const {error}=await supabase.storage.from(bucket).upload(path,file,{upsert:false,contentType:file.type});
    if(error){alert(error.message);setUploading(false);return}
    const {data}=supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };

  return <div className="mediaField">
    <div className="mediaFieldTop"><b>{label}</b>{value&&<a href={value} target="_blank">Abrir arquivo</a>}</div>
    <div className="mediaPreview">{value?<img src={value} alt={label}/>:<span>Sem arquivo</span>}</div>
    <label className="uploadButton">{uploading?"Enviando...":"Fazer upload"}<input type="file" accept={accept} disabled={uploading} onChange={e=>upload(e.target.files?.[0])}/></label>
    <input className="mediaUrl" value={value||""} onChange={e=>onChange(e.target.value)} placeholder="Ou cole uma URL"/>
  </div>
}
