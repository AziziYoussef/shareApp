# 🚀 Guide de Déploiement - Screen Share App

## Prérequis

- Docker et Docker Compose installés
- Port 80 (HTTP) et 3001 (WebSocket) disponibles
- (Optionnel) Nom de domaine pour HTTPS

## 📦 Déploiement avec Docker

### 1. Build et lancement rapide

```bash
# Build et démarrer tous les services
docker-compose up -d --build

# Vérifier que les conteneurs tournent
docker-compose ps

# Voir les logs
docker-compose logs -f
```

L'application sera accessible sur :
- **Frontend** : http://localhost
- **Serveur de signalisation** : http://localhost:3001

### 2. Arrêter l'application

```bash
docker-compose down
```

### 3. Redémarrer l'application

```bash
docker-compose restart
```

## 🌐 Déploiement en Production

### Configuration HTTPS (Recommandé)

Pour un déploiement en production avec HTTPS :

1. **Modifier `src/frontend/hooks/useWebRTC.ts`** :
```typescript
const SIGNALING_SERVER_URL = "https://votre-domaine.com";
```

2. **Ajouter un reverse proxy Nginx avec SSL** :

Créer `docker-compose.prod.yml` :

```yaml
version: '3.8'

services:
  signaling-server:
    build:
      context: .
      dockerfile: Dockerfile.signaling
    container_name: screen-share-signaling
    environment:
      - PORT=3001
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - screen-share-network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: screen-share-frontend
    restart: unless-stopped
    networks:
      - screen-share-network

  nginx:
    image: nginx:alpine
    container_name: screen-share-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - signaling-server
    restart: unless-stopped
    networks:
      - screen-share-network

networks:
  screen-share-network:
    driver: bridge
```

3. **Obtenir un certificat SSL avec Let's Encrypt** :

```bash
# Installer certbot
sudo apt install certbot

# Obtenir le certificat
sudo certbot certonly --standalone -d votre-domaine.com
```

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` :

```env
# Production
VITE_SIGNALING_SERVER_URL=https://votre-domaine.com
PORT=3001
NODE_ENV=production
```

### Ports

- **80** : Frontend HTTP
- **443** : Frontend HTTPS (production)
- **3001** : Serveur de signalisation WebSocket

## 📊 Monitoring

### Vérifier la santé des services

```bash
# Status des conteneurs
docker-compose ps

# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f frontend
docker-compose logs -f signaling-server
```

### Healthchecks

Les services ont des healthchecks automatiques :
- Frontend : vérifie que nginx répond
- Signaling : vérifie que le serveur WebSocket répond

## 🔒 Sécurité

### Recommandations pour la production

1. **Activer HTTPS** (obligatoire pour getDisplayMedia)
2. **Configurer CORS** correctement dans le serveur de signalisation
3. **Limiter les origines** autorisées
4. **Ajouter un pare-feu** (UFW, iptables)
5. **Utiliser des secrets** pour les tokens (si authentification ajoutée)

### Exemple de configuration CORS sécurisée

Dans `signaling-server/index.js` :

```javascript
const io = new Server(httpServer, {
  cors: {
    origin: ["https://votre-domaine.com"],
    methods: ["GET", "POST"],
    credentials: true
  },
});
```

## 🚢 Déploiement sur serveurs cloud

### DigitalOcean / Linode / AWS EC2

```bash
# 1. Se connecter au serveur
ssh user@votre-serveur

# 2. Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Installer Docker Compose
sudo apt install docker-compose

# 4. Cloner le repo
git clone https://github.com/votre-repo/screen-share-app.git
cd screen-share-app

# 5. Lancer l'application
docker-compose up -d --build
```

### Heroku

Créer un `heroku.yml` :

```yaml
build:
  docker:
    web: Dockerfile.frontend
    signaling: Dockerfile.signaling
run:
  web: /bin/sh -c "nginx -g 'daemon off;'"
  signaling: node index.js
```

```bash
# Déployer sur Heroku
heroku create votre-app
heroku stack:set container
git push heroku main
```

## 📈 Optimisations

### Performance

1. **CDN** : Servir les assets statiques via CDN
2. **Compression** : Déjà activée dans nginx.conf (gzip)
3. **Cache** : Les assets sont cachés 1 an
4. **HTTP/2** : Activer dans nginx pour la production

### Scalabilité

Pour supporter plus d'utilisateurs :

```yaml
# docker-compose.scale.yml
services:
  signaling-server:
    deploy:
      replicas: 3
    # Ajouter un load balancer (HAProxy ou nginx)
```

## 🐛 Dépannage

### Le frontend ne se connecte pas au serveur

```bash
# Vérifier les logs
docker-compose logs signaling-server

# Vérifier la connectivité réseau
docker exec -it screen-share-frontend ping signaling-server
```

### WebRTC ne fonctionne pas

- Vérifier que HTTPS est activé (requis pour getDisplayMedia)
- Vérifier les serveurs STUN/TURN dans le code
- Ouvrir les ports nécessaires dans le pare-feu

### Build qui échoue

```bash
# Nettoyer et rebuild
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 📝 Maintenance

### Mise à jour

```bash
# Pull les dernières modifications
git pull

# Rebuild et redémarrer
docker-compose up -d --build
```

### Backup

```bash
# Les données importantes à sauvegarder :
# - docker-compose.yml
# - nginx.conf
# - .env
# - Certificats SSL (/etc/letsencrypt/)
```

## 🆘 Support

En cas de problème :
1. Vérifier les logs : `docker-compose logs -f`
2. Vérifier la santé : `docker-compose ps`
3. Tester la connectivité réseau
4. Vérifier la configuration HTTPS
