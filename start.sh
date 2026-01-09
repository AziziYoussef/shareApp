#!/bin/bash

echo "🚀 Screen Share App - Démarrage"
echo "================================"
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    echo "Installez Docker : https://docs.docker.com/get-docker/"
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    echo "Installez Docker Compose : https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker et Docker Compose sont installés"
echo ""

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

echo ""
echo "🔨 Build des images Docker..."
docker-compose build

echo ""
echo "🚀 Démarrage des services..."
docker-compose up -d

echo ""
echo "⏳ Attente du démarrage des services..."
sleep 5

echo ""
echo "✅ Application démarrée !"
echo ""
echo "📡 Services disponibles :"
echo "  - Frontend :              http://localhost"
echo "  - Serveur de signalisation : http://localhost:3001"
echo ""
echo "📊 Commandes utiles :"
echo "  - Voir les logs :         docker-compose logs -f"
echo "  - Arrêter :              docker-compose down"
echo "  - Redémarrer :           docker-compose restart"
echo ""
echo "🎉 Bon partage d'écran !"
