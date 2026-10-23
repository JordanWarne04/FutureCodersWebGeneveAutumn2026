<script>
    let { data } = $props();

    let frame = $state(null);
    let fullscreen = $state(false);

    function openFullscreen() {
        frame?.requestFullscreen();
    }

    function updateFullscreen() {
        fullscreen = !!document.fullscreenElement;
    }
</script>

<svelte:document onfullscreenchange={updateFullscreen} />

<main>
    <a href="/">← Retour à la galerie</a>

    <h1>{data.project.title}</h1>

    <p>
        Par {data.project.first_name} ·
        {data.project.description}
    </p>

    <div class="project-actions">
        <button onclick={openFullscreen}>
            ⛶ Plein écran
        </button>
    </div>

    <p class="muted">
        Tu peux naviguer entre les pages à l'intérieur de cet aperçu.
        Appuie sur Échap pour quitter le plein écran.
    </p>

    <iframe
        bind:this={frame}
        class="project-frame"
        title={data.project.title}
        src={'/site/' + data.project.id + '/index.html'}
        sandbox="allow-scripts"
        allowfullscreen
    ></iframe>
</main>

<style>
    .project-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin: 1.5rem 0;
    }

    .project-actions button,
    .project-actions .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.2rem;
        border-radius: 0.7rem;
        border: 0;
        background: #2563eb;
        color: white;
        font: inherit;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
    }

    .project-actions button:hover,
    .project-actions .button:hover {
        background: #1d4ed8;
    }

    .project-frame:fullscreen {
        width: 100vw;
        height: 100vh;
        border: none;
        background: white;
    }

    @media (max-width: 600px) {
        .project-actions {
            flex-direction: column;
        }
    }
</style>
