# 🔥 Configuration Firebase pour Screen Share App

## Ce qu'il faut sélectionner dans `firebase init`

### ✅ **Hosting** (OBLIGATOIRE)
- **Pourquoi** : Pour héberger votre application React (build de production)
- **Ce que ça fait** : Configure le déploiement de votre app web statique
- **Configuration** :
  - Public directory : `dist` (ou `build` selon votre config Vite)
  - Single-page app : **Oui** (car React Router)
  - GitHub Actions : Optionnel (mais recommandé)

### ⚠️ **Functions** (OPTIONNEL)
- **Pourquoi** : Si vous voulez migrer votre serveur de signalisation vers Firebase Functions
- **Note** : Vous avez déjà un serveur Node.js (`signaling-server/`), donc ce n'est **pas nécessaire** pour l'instant
- **Quand l'utiliser** : Si vous voulez une solution serverless pour le WebSocket

### ❌ **App Hosting** (NON NÉCESSAIRE)
- **Pourquoi** : C'est pour les apps full-stack avec SSR
- **Votre cas** : Vous avez une SPA React + serveur séparé, donc pas besoin

### ❌ **Storage** (OPTIONNEL)
- **Pourquoi** : Seulement si vous voulez stocker des fichiers (enregistrements, etc.)
- **Pour l'instant** : Pas nécessaire

## 📋 Recommandation

**Sélectionnez uniquement :**
- ✅ **Hosting**

## 🚀 Étapes après `firebase init`

### 1. Configuration Hosting

Firebase va créer un fichier `firebase.json`. Vérifiez qu'il ressemble à :

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 2. Build de production

```bash
npm run build
```

### 3. Déployer

```bash
firebase deploy --only hosting
```

## 🔧 Configuration pour HTTPS (Important pour getDisplayMedia)

Firebase Hosting fournit automatiquement HTTPS, ce qui est **essentiel** pour `getDisplayMedia` qui nécessite un contexte sécurisé.

## 📝 Fichiers créés par Firebase

Après `firebase init`, vous aurez :
- `firebase.json` - Configuration Firebase
- `.firebaserc` - Projet Firebase sélectionné
- `firebase/` (si Functions sélectionné) - Code des fonctions

## ⚠️ Important : Serveur de signalisation

Votre serveur de signalisation (`signaling-server/`) doit être déployé **séparément** :
- Sur un VPS (DigitalOcean, AWS EC2, etc.)
- Sur Railway, Render, ou Heroku
- Ou migrer vers Firebase Functions (plus complexe)

Firebase Hosting ne peut pas héberger un serveur WebSocket Node.js directement.

## 🎯 Checklist

- [ ] Sélectionner **Hosting** dans `firebase init`
- [ ] Vérifier que `firebase.json` pointe vers `dist`
- [ ] Tester le build local : `npm run build`
- [ ] Déployer : `firebase deploy --only hosting`
- [ ] Vérifier que l'app fonctionne sur l'URL Firebase
- [ ] Configurer le serveur de signalisation séparément

## 🔗 URLs après déploiement

- **Frontend** : `https://votre-projet.web.app` (Firebase Hosting)
- **Signalisation** : `wss://votre-serveur.com` (VPS ou service cloud)
