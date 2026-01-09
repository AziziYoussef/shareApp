# Serveur de Signalisation WebRTC

Serveur WebSocket simple pour coordonner les connexions WebRTC peer-to-peer.

## Installation

```bash
cd signaling-server
npm install
```

## Démarrage

Mode développement (avec rechargement automatique):
```bash
npm run dev
```

Mode production:
```bash
npm start
```

Le serveur écoute sur le port 3001 par défaut.

## Configuration

Vous pouvez changer le port en définissant la variable d'environnement `PORT`:
```bash
PORT=3002 npm start
```

## Fonctionnalités

- Création et gestion de salons
- Signalisation WebRTC (offers, answers, ICE candidates)
- Gestion des connexions/déconnexions des utilisateurs
