# 🎥 Screen Share App

Application web de partage d'écran et audio en temps réel avec WebRTC.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Fonctionnalités

- 📺 **Partage d'écran** en haute qualité (1080p @ 30fps)
- 🎤 **Microphone** avec réduction de bruit
- 🔊 **Partage audio système** (son de l'ordinateur)
- 👥 **Multi-utilisateurs** - plusieurs participants par salle
- 🔄 **Reconnexion automatique** - reste dans la salle après F5
- 🌐 **WebRTC P2P** - connexion directe entre pairs
- 🔒 **Salles privées** - code unique pour chaque salle
- 📱 **Responsive** - fonctionne sur tous les navigateurs modernes

## 🚀 Démarrage Rapide

### Option 1 : Docker (Recommandé)

```bash
# Lancer l'application avec Docker
./start.sh
```

L'application sera disponible sur **http://localhost**

### Option 2 : Développement Local

```bash
# Terminal 1 - Serveur de signalisation
cd signaling-server
npm install
npm run dev

# Terminal 2 - Frontend
npm install
npm run dev
```

Frontend : **http://localhost:3000**

## 📋 Prérequis

### Pour Docker
- Docker >= 20.10
- Docker Compose >= 1.29

### Pour développement local
- Node.js >= 20
- npm >= 9

## 🎮 Utilisation

1. **Créer une salle**
   - Entrez votre nom
   - Cliquez sur "Créer une salle"
   - Partagez le code de salle avec les autres

2. **Rejoindre une salle**
   - Entrez votre nom
   - Entrez le code de salle
   - Cliquez sur "Rejoindre"

3. **Partager votre écran**
   - Cliquez sur "Démarrer"
   - Sélectionnez l'écran/fenêtre à partager
   - Les autres participants verront votre écran

4. **Utiliser le microphone**
   - Le micro démarre automatiquement
   - Cliquez sur le bouton micro pour mute/unmute
   - Indicateur vert "🎤 En direct" quand actif

## 🏗️ Architecture

**Technologies :**
- **Frontend** : React 18 + TypeScript + Tailwind CSS + Vite
- **Backend** : Node.js + Socket.io (signaling)
- **WebRTC** : Connexions peer-to-peer
- **State** : Zustand (avec persistance)

## 📁 Structure du Projet

```
screen-share-app/
├── src/
│   ├── frontend/              # Code React
│   │   ├── components/        # Composants UI
│   │   ├── hooks/            # Hooks React (WebRTC)
│   │   ├── stores/           # Zustand stores
│   │   └── utils/            # Utilitaires
│   └── shared/               # Types partagés
├── signaling-server/         # Serveur WebSocket
├── Dockerfile.frontend       # Docker frontend
├── Dockerfile.signaling      # Docker signaling
├── docker-compose.yml        # Configuration Docker
└── DEPLOYMENT.md            # Guide de déploiement
```

## 🔧 Configuration

### Variables d'environnement

Créer `.env` à la racine :

```env
VITE_SIGNALING_SERVER_URL=http://localhost:3001
```

### Pour la production

Voir le guide détaillé dans [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🐛 Debug

Un panneau de debug est disponible en cliquant sur le bouton Bug 🐛 en bas à droite.

## 🌐 Navigateurs Supportés

| Navigateur | Version | Support |
|-----------|---------|---------|
| Chrome    | >= 74   | ✅ Complet |
| Firefox   | >= 66   | ✅ Complet |
| Safari    | >= 12   | ✅ Complet (avec HTTPS) |
| Edge      | >= 79   | ✅ Complet |

**Note** : HTTPS est requis pour `getDisplayMedia` en production.

## 🚢 Déploiement

```bash
# Sur votre serveur
git clone <votre-repo>
cd screen-share-app
./start.sh
```

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions complètes.

## 📝 License

MIT License

---

⭐ N'oubliez pas de star le repo si vous l'aimez !
