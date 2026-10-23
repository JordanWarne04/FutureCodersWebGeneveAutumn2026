<script>
 import { enhance } from '$app/forms';
 let {data,form}=$props();
 let mode=$state('folder');
 let folderInput;
 let chosen=$state('');
 function prepare({formData,cancel}){
  if(mode!=='folder')return;
  const files=Array.from(folderInput?.files||[]);
  if(!files.length){alert('Choisis un dossier.');cancel();return;}
  formData.delete('files');
  for(const file of files){
   const parts=file.webkitRelativePath.split('/');
   const relative=parts.slice(1).join('/');
   if(!relative)continue;
   formData.append('files',file,file.name);
   formData.append('paths',relative);
  }
 }
</script>
<svelte:head><title>Déposer mon site — Future Coders</title></svelte:head>
<main>
 <h1>Déposer mon site web 🚀</h1>
 {#if !data.enabled}
  <p>Les dépôts sont actuellement fermés. Demande à ton enseignant.</p>
 {:else}
  <div class="panel">
   <p>Prépare un dossier contenant <code>index.html</code>, tes pages, images, fichiers CSS et JavaScript. Tu peux conserver tous tes sous-dossiers !</p>
   {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
   {#if form?.success}
    <p class="success">Bravo, ton site a été envoyé ! {form.approval?'Il sera visible après validation par ton enseignant.':'Il est maintenant visible dans la galerie.'}</p>
    <a class="btn" href="/">Retour à la galerie</a>
   {:else}
    <form method="POST" enctype="multipart/form-data" use:enhance={prepare}>
     <label>Ton prénom<input name="first" maxlength="80" required autocomplete="given-name" /></label>
     <label>Nom de ton projet<input name="title" maxlength="120" required /></label>
     <label>Description de ton projet<textarea name="description" maxlength="800" rows="4" required></textarea></label>
     <label>Comment veux-tu envoyer ton site ?
      <select name="mode" bind:value={mode}>
       <option value="folder">Choisir un dossier (recommandé)</option>
       <option value="zip">Envoyer un fichier ZIP</option>
      </select>
     </label>
     {#if mode==='folder'}
      <label>Dossier de ton site
       <input bind:this={folderInput} type="file" name="files" webkitdirectory multiple required onchange={(e)=>chosen=e.currentTarget.files?.[0]?.webkitRelativePath.split('/')[0]||''} />
      </label>
      {#if chosen}<p class="muted">Dossier sélectionné : {chosen}</p>{/if}
     {:else}
      <label>Fichier ZIP<input name="site" type="file" accept=".zip,application/zip" required /></label>
     {/if}
     <small>20 Mo et 250 fichiers maximum (ZIP : 10 Mo). Aucun nom de famille demandé. Ton site doit contenir un fichier index.html à la racine.</small>
     <button>Envoyer mon projet</button>
    </form>
   {/if}
  </div>
 {/if}
</main>
