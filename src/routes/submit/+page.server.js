import { fail } from '@sveltejs/kit';
import { setting } from '$lib/server/db';
import { create, createFolder } from '$lib/server/projects';
export function load(){return {enabled:setting('submissions_enabled'),approval:setting('approval_required')}}
const text=(form,key,max)=>String(form.get(key)||'').trim().slice(0,max);
export const actions={default:async({request})=>{
 if(!setting('submissions_enabled'))return fail(403,{error:'Les dépôts sont fermés.'});
 const f=await request.formData();const first=text(f,'first',80),title=text(f,'title',120),description=text(f,'description',800);
 if(!first||!title||!description)return fail(400,{error:'Tous les champs sont obligatoires.'});
 const mode=String(f.get('mode')||'folder');
 try{
  if(mode==='zip'){
   const upload=f.get('site');
   if(!(upload instanceof File)||!upload.size||!upload.name.toLowerCase().endsWith('.zip'))return fail(400,{error:'Choisis un fichier ZIP.'});
   if(upload.size>10_000_000)return fail(413,{error:'Le ZIP ne doit pas dépasser 10 Mo.'});
   create({first,title,description},Buffer.from(await upload.arrayBuffer()));
  }else{
   const uploads=f.getAll('files');const paths=f.getAll('paths').map(String);
   if(!uploads.length||uploads.length!==paths.length||uploads.length>250||uploads.some(x=>!(x instanceof File)))return fail(400,{error:'Sélectionne un dossier valide (250 fichiers maximum).'});
   let size=0;const files=[];
   for(let i=0;i<uploads.length;i++){
    size+=uploads[i].size;if(size>20_000_000)return fail(413,{error:'Le dossier dépasse 20 Mo.'});
    files.push([paths[i],Buffer.from(await uploads[i].arrayBuffer())]);
   }
   createFolder({first,title,description},files);
  }
 }catch(e){return fail(400,{error:e.message})}
 return {success:true,approval:setting('approval_required')};
}};
