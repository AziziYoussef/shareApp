# 🚀 Démarrage Ultra-Rapide

## En 3 étapes

### 1️⃣ Installer Docker

```bash
# Vérifier si Docker est installé
docker --version

# Si non installé :
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 2️⃣ Lancer l'application

```bash
./start.sh
```

### 3️⃣ Ouvrir dans le navigateur

Aller sur **http://localhost**

## C'est tout ! 🎉

---

## Commandes utiles

```bash
# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Redémarrer
docker-compose restart

# Rebuild complet
docker-compose down -v && docker-compose up -d --build
```

## Problèmes courants

### Port 80 déjà utilisé

```bash
# Modifier le port dans docker-compose.yml
ports:
  - "8080:80"  # Utiliser le port 8080 au lieu de 80
```

Puis accéder à `http://localhost:8080`

### Permissions Docker

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Le build échoue

```bash
# Nettoyer et recommencer
docker system prune -a
./start.sh
```

## Sans Docker ?

```bash
# Terminal 1
cd signaling-server
npm install && npm run dev

# Terminal 2
npm install && npm run dev
```

Ouvrir `http://localhost:3000`
