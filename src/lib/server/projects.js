import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { join, posix } from 'node:path';
import { randomUUID } from 'node:crypto';
import AdmZip from 'adm-zip';
import { env } from '$env/dynamic/private';
import { db,setting } from './db.js';
const root=join(env.DATA_DIR||'/data','projects');mkdirSync(root,{recursive:true});
const allowed=new Set(['.html','.htm','.css','.js','.mjs','.json','.png','.jpg','.jpeg','.gif','.webp','.svg','.ico','.avif','.woff','.woff2','.ttf','.otf','.txt','.webmanifest','.mp3','.mp4','.ogg','.wav']);
const ext=n=>n.slice(n.lastIndexOf('.')).toLowerCase();
export const all = (admin=false) => db.prepare(`SELECT * FROM projects ${admin?'':'WHERE approved=1'} ORDER BY first_name COLLATE NOCASE, title COLLATE NOCASE`).all();
export const get = id => db.prepare('SELECT * FROM projects WHERE id=?').get(id);
function save(fields,files){
 if(files.length===0||files.length>250)throw Error('Le dossier doit contenir entre 1 et 250 fichiers.');
 let total=0;const seen=new Set();const clean=[];
 for(const [raw,data] of files){
  const name=raw.replaceAll('\\','/');
  if(!name||name.length>240||name.startsWith('/')||name.split('/').some(x=>!x||x==='..'||x==='.'||x.startsWith('.'))||!allowed.has(ext(name))||!/^[\w\- ./À-ÿ]+$/.test(name))throw Error('Nom ou type de fichier non autorisé : '+name);
  if(seen.has(name.toLowerCase()))throw Error('Deux fichiers ont le même nom : '+name);
  seen.add(name.toLowerCase());total+=data.length;
  if(total>20_000_000)throw Error('Le projet dépasse 20 Mo.');
  clean.push([name,data]);
 }
 if(!seen.has('index.html'))throw Error('Le dossier doit contenir index.html à sa racine.');
 const id=randomUUID(),folder=join(root,id);mkdirSync(folder);
 try{
  for(const [name,data] of clean){const dest=join(folder,name);mkdirSync(join(dest,'..'),{recursive:true});writeFileSync(dest,data,{flag:'wx'});}
  db.prepare('INSERT INTO projects(id,first_name,last_name,title,description,approved) VALUES(?,?,?,?,?,?)').run(id,fields.first,'',fields.title,fields.description,setting('approval_required')?0:1);
  return id;
 }catch(e){rmSync(folder,{recursive:true,force:true});throw e;}
}
export function createFolder(fields,files){return save(fields,files);}
export function create(fields,archive){
 const zip=new AdmZip(archive);const entries=zip.getEntries();if(entries.length>250)throw Error('Le ZIP contient trop de fichiers.');
 const raw=entries.filter(e=>!e.isDirectory).map(e=>e.entryName.replaceAll('\\','/'));
 const prefix=raw.length&&raw.every(n=>n.includes('/')&&n.startsWith(raw[0].split('/')[0]+'/'))?raw[0].split('/')[0]+'/':'';
 const files=[];
 for(const entry of entries){if(entry.isDirectory)continue;
  const mode=(entry.attr>>>16)&0o170000;if(mode===0o120000)throw Error('Les liens symboliques ne sont pas autorisés.');
  files.push([entry.entryName.replaceAll('\\','/').slice(prefix.length),entry.getData()]);
 }
 return save(fields,files);
}
export function remove(id){db.prepare('DELETE FROM projects WHERE id=?').run(id);rmSync(join(root,id),{recursive:true,force:true});}
export function file(id,name){if(!/^[a-f0-9-]{36}$/.test(id)||name.startsWith('/')||name.split('/').some(x=>x==='..'||x==='.'||x.startsWith('.')))throw Error('Chemin invalide');return readFileSync(join(root,id,name));}
