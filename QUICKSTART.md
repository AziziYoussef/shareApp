# Guide de Démarrage Rapide

## Installation Initiale

1. **Installer les dépendances frontend:**
```bash
npm install
```

2. **Installer les dépendances du serveur de signalisation:**
```bash
cd signaling-server
npm install
cd ..
```

## Premier Lancement

### Terminal 1 - Serveur de signalisation
```bash
cd signaling-server
npm run dev
```

Vous devriez voir: `Signaling server running on port 3001`

### Terminal 2 - Application Tauri
```bash
npm run tauri:dev
```

L'application se lancera automatiquement dans une fenêtre.

## Utilisation

1. **Créer une salle:**
   - Entrez votre nom d'utilisateur
   - Cliquez sur "Créer une salle"
   - Un code de salle sera généré (ex: "ABC123")

2. **Rejoindre une salle:**
   - Entrez votre nom d'utilisateur
   - Entrez le code de salle
   - Cliquez sur "Rejoindre"

3. **Partager l'écran:**
   - Sélectionnez l'écran à partager
   - Cliquez sur "Démarrer"
   - Les autres participants verront votre écran

4. **Contrôles audio:**
   - Utilisez les boutons pour activer/désactiver le micro
   - Ajustez le volume avec le slider

## Dépannage

### Erreur: `javascriptcoregtk-4.0` not found ou `unable to find library -lwebkit2gtk-4.0`
**Solution**: 
1. Installez les dépendances système Linux (voir [INSTALL_DEPS.md](./INSTALL_DEPS.md))
2. Créez les liens symboliques pour les bibliothèques :
   ```bash
   ./scripts/create-lib-symlinks.sh
   ```
3. Le projet inclut automatiquement des fichiers pkg-config de compatibilité dans `pkgconfig/`
4. Les scripts `tauri:dev` et `tauri:build` configurent automatiquement `PKG_CONFIG_PATH`
5. Si vous avez `libwebkit2gtk-4.1-dev` installé, exécutez le script ci-dessus pour créer les liens

### L'application ne se connecte pas
- Vérifiez que le serveur de signalisation est lancé
- Vérifiez que le port 3001 n'est pas utilisé par un autre processus

### Erreur de build Rust
- Vérifiez que Rust est installé: `rustc --version`
- Installez les composants nécessaires: `rustup component add rust-src`

### Permissions d'écran refusées
- Sur macOS: Système > Confidentialité > Enregistrement d'écran
- Sur Linux: Vérifiez les permissions X11
- Sur Windows: Vérifiez les paramètres de confidentialité

## Commandes Utiles

```bash
# Nettoyer les builds
npm run tauri clean

# Build de production
npm run tauri:build

# Vérifier le code TypeScript
npx tsc --noEmit

# Formater le code
npx prettier --write .
```
