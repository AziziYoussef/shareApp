# 📝 Changelog

## Version 1.0.0 (2026-01-09)

### ✨ Nouvelles fonctionnalités

- **Partage d'écran** : 1080p @ 30fps avec sélection d'écran/fenêtre
- **Partage audio système** : Son de l'ordinateur partagé avec les participants
- **Microphone** : Communication audio avec réduction de bruit et echo cancellation
- **Salles privées** : Codes de salle uniques générés automatiquement
- **Multi-utilisateurs** : Support de plusieurs participants par salle
- **Reconnexion automatique** : Reste dans la salle après un refresh (F5)
- **Panneau de debug** : Bouton Bug 🐛 pour voir l'état en temps réel
- **Indicateurs visuels** :
  - Badge vert "Votre partage" pour la vidéo locale
  - Indicateur "🎤 En direct" pour le micro actif
  - Icône moniteur 📺 pour les participants qui partagent
  - Statut de connexion WebRTC (connecting/connected)

### 🔧 Améliorations techniques

#### WebRTC
- Gestion du "glare" (offres simultanées)
- Prévention des connexions en double
- Renégociation intelligente (vérification de l'état de signaling)
- Évite d'ajouter les mêmes tracks plusieurs fois
- Meilleure gestion des erreurs WebRTC

#### Performance
- Résolution optimisée : 1920x1080 @ 30 FPS
- Codec vidéo : VP8/VP9 (défaut WebRTC)
- Codec audio : Opus 48kHz
- Compression gzip activée (nginx)
- Cache des assets : 1 an

#### Persistance
- Store Zustand avec localStorage
- Sauvegarde du roomId et userName
- Reconnexion automatique après refresh

#### Sécurité
- Headers de sécurité configurés (nginx)
- CORS configuré correctement
- Nettoyage des ressources à la déconnexion

### 🐛 Corrections de bugs

- ✅ Résolu : Écran noir lors du partage local
- ✅ Résolu : Connexions WebRTC en double
- ✅ Résolu : Erreurs "Cannot set local offer in state have-remote-offer"
- ✅ Résolu : Perte de connexion après F5
- ✅ Résolu : Noms d'utilisateurs non stockés sur le serveur
- ✅ Résolu : Streams distants qui disparaissent après 2s
- ✅ Résolu : Glare WebRTC (offres simultanées)

### 🚀 Déploiement

- **Docker** : Configuration complète avec docker-compose
- **Nginx** : Serveur web optimisé avec gzip et caching
- **Multi-stage build** : Images Docker optimisées
- **Healthchecks** : Surveillance automatique des services
- **Script de démarrage** : `./start.sh` pour lancer rapidement
- **Documentation** : Guide de déploiement complet

### 📚 Documentation

- `README.md` : Guide principal avec toutes les infos
- `DEPLOYMENT.md` : Guide de déploiement détaillé
- `QUICK_START.md` : Démarrage ultra-rapide
- `CHANGELOG.md` : Ce fichier
- Commentaires de code améliorés
- Logs de debug détaillés

### 🔄 Refactoring

- Architecture améliorée avec stores séparés :
  - `appStore.ts` : État de l'application
  - `webrtcStore.ts` : État WebRTC (socket, peers, streams)
- Hooks React optimisés
- Composants mieux organisés
- Meilleure séparation des responsabilités

### 📊 Métriques

- **Bundle size** : 221 kB (69 kB gzippé)
- **CSS** : 11 kB (3 kB gzippé)
- **Build time** : ~3 secondes
- **Latence WebRTC** : < 500ms (réseau local)

### 🌐 Compatibilité

- Chrome >= 74 ✅
- Firefox >= 66 ✅
- Safari >= 12 ✅ (avec HTTPS)
- Edge >= 79 ✅

### 🛠️ Stack technique

```
Frontend:
├── React 18
├── TypeScript 5.3
├── Tailwind CSS 3.4
├── Vite 5.0
├── Zustand 4.5
├── Socket.io-client 4.6
└── Lucide React (icons)

Backend:
├── Node.js 20
├── Express
├── Socket.io 4.6
└── CORS

DevOps:
├── Docker
├── Docker Compose
├── Nginx Alpine
└── Node Alpine

WebRTC:
├── RTCPeerConnection
├── getDisplayMedia API
├── getUserMedia API
└── STUN servers (Google)
```

### 🔮 Roadmap (À venir)

#### v1.1.0 (Prochaine version)
- [ ] Chat textuel entre participants
- [ ] Enregistrement des sessions
- [ ] Indicateur de niveau audio visuel
- [ ] Statistiques réseau en temps réel (FPS, bitrate, latence)
- [ ] Qualité adaptative selon la bande passante

#### v1.2.0
- [ ] Authentification utilisateur
- [ ] Salles persistantes
- [ ] Historique des salles
- [ ] Partage de fichiers

#### v2.0.0
- [ ] Application mobile (React Native)
- [ ] Serveurs TURN personnalisés
- [ ] Chiffrement end-to-end
- [ ] API REST pour intégrations
- [ ] Webhooks

### 🙏 Remerciements

- WebRTC community
- React team
- Tailwind CSS
- Socket.io

---

Pour signaler un bug ou suggérer une fonctionnalité, ouvrir une issue sur GitHub.
