# Galerie Future Coders 🚀

Galerie de projets web pour un stage en français. Les élèves déposent un dossier sélectionné directement (ou un ZIP) contenant `index.html`, d'autres pages HTML, images, CSS, JavaScript et sous-dossiers. Seul leur **prénom** est demandé et affiché. Classement alphabétique par prénom.

## Déploiement Dokploy

1. Déployer ce dépôt comme application **Docker Compose** dans Dokploy.
2. Configurer `ADMIN_PASSWORD` (au moins 12 caractères) et `ORIGIN` (par ex. `https://galerie.example.ch`).
3. Associer le domaine au service `gallery`, port 3000.
4. Ouvrir `/admin` pour activer/désactiver les dépôts et valider les projets.
5. Conserver le volume Docker `gallery_data` pour garder les fichiers et SQLite.

## Préparer son site

Le dossier doit contenir `index.html` à sa racine (un dossier parent unique est accepté). Les liens relatifs tels que `images/photo.png` et `page2.html` fonctionnent. Taille maximum : dossier 20 Mo, ZIP 10 Mo, 250 fichiers. La sélection du dossier nécessite JavaScript et un navigateur récent. Extensions web courantes uniquement. Pas de PHP ni de code côté serveur.

## Sécurité et confidentialité

Les projets sont affichés dans des iframes avec `sandbox="allow-scripts"` **sans** `allow-same-origin`, ce qui donne une origine opaque au contenu exécuté dans l'iframe. Une CSP limite les requêtes réseau et interdit les formulaires. La validation avant publication est activée par défaut pour les nouvelles installations. Le code soumis reste non fiable : pour un déploiement public, utiliser de préférence un domaine distinct de vos autres services, HTTPS et des limites de ressources au proxy. Ne pas stocker d'informations personnelles dans les projets. Les projets existants ne sont pas automatiquement anonymisés : supprimer les anciens noms de famille depuis l'administration ou la base si vous migrez depuis une version antérieure.

## Développement

`npm install && npm run dev` avec `DATA_DIR=./data` et `ADMIN_PASSWORD` défini.
