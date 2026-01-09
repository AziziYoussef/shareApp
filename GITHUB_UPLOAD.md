# 📤 Guide Upload GitHub - Étape par Étape

## ✅ Pré-vérifications de Sécurité

### 1. Vérifier qu'aucun secret n'est présent

```bash
# Vérifier les fichiers .env
ls -la | grep .env
# ✅ .env.example doit être là
# ❌ .env ne doit PAS être là (dans .gitignore)

# Vérifier qu'aucun token/password dans le code
grep -r "password\|token\|secret\|api_key" src/ --exclude-dir=node_modules
```

### 2. Vérifier le .gitignore

```bash
cat .gitignore | grep -E ".env$|node_modules|dist"
# Doit contenir : .env, node_modules, dist
```

## 🚀 Étapes d'Upload

### Étape 1 : Initialiser Git (déjà fait ✅)

```bash
git init
```

### Étape 2 : Configurer Git (première fois)

```bash
# Configurer votre nom et email
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Vérifier la config
git config --list
```

### Étape 3 : Créer un repository sur GitHub

1. Aller sur https://github.com
2. Cliquer sur le bouton **"New"** (ou le `+` en haut à droite)
3. Remplir :
   - **Repository name** : `screen-share-app` (ou autre nom)
   - **Description** : `🎥 Application web de partage d'écran en temps réel avec WebRTC`
   - **Public** ou **Private** : À votre choix
   - ❌ **NE PAS** cocher "Add README" (on a déjà le nôtre)
   - ❌ **NE PAS** cocher "Add .gitignore" (on a déjà le nôtre)
   - ✅ **Choisir** une license : MIT
4. Cliquer **"Create repository"**

### Étape 4 : Ajouter les fichiers au staging

```bash
cd ~/discord\ app

# Voir les fichiers qui seront ajoutés
git status

# Ajouter TOUS les fichiers
git add .

# Vérifier ce qui est stagged
git status
```

**⚠️ VÉRIFICATION IMPORTANTE** :
```bash
# Vérifier qu'aucun .env n'est ajouté
git status | grep ".env"
# ✅ Ne doit afficher que .env.example
# ❌ Si vous voyez ".env" (sans .example), STOP !

# Si .env est listé, le retirer :
git reset .env
```

### Étape 5 : Créer le premier commit

```bash
git commit -m "🎉 Initial commit - Screen Share App v1.0.0

✨ Fonctionnalités :
- Partage d'écran 1080p @ 30fps
- Partage audio système
- Microphone avec réduction de bruit
- Multi-utilisateurs avec salles privées
- Reconnexion automatique
- Panel de debug

🐳 Docker :
- Configuration complète
- docker-compose.yml
- Scripts de démarrage

📚 Documentation :
- README.md complet
- Guide de déploiement
- Changelog détaillé
- Guide de sécurité"
```

### Étape 6 : Lier au repository GitHub

```bash
# Remplacer VOTRE-USERNAME et VOTRE-REPO par vos valeurs
git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git

# Vérifier
git remote -v
```

### Étape 7 : Push vers GitHub

```bash
# Première fois (créer la branche main)
git branch -M main
git push -u origin main
```

**Si demande de login** :
```bash
# GitHub ne supporte plus les mots de passe
# Utilisez un Personal Access Token (PAT)

# 1. Aller sur GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
# 2. Generate new token
# 3. Cocher : repo, workflow
# 4. Copier le token
# 5. Utiliser le token comme mot de passe
```

### Étape 8 : Vérifier sur GitHub

1. Aller sur `https://github.com/VOTRE-USERNAME/VOTRE-REPO`
2. Vérifier que les fichiers sont là
3. **IMPORTANT** : Vérifier qu'il n'y a PAS de fichier `.env` (seulement `.env.example`)

## 🔒 Vérifications Post-Upload

### 1. Vérifier les secrets

```bash
# Sur GitHub, aller dans votre repo
# Chercher ".env" dans la barre de recherche
# ✅ Doit trouver seulement .env.example
# ❌ Si .env apparaît, SUPPRIMER LE REPO et recommencer
```

### 2. Tester le clone

```bash
# Dans un autre dossier
git clone https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
cd VOTRE-REPO

# Vérifier qu'il n'y a pas de .env
ls -la | grep .env
# ✅ Doit afficher seulement .env.example

# Tester le démarrage
cp .env.example .env
./start.sh
```

## 📝 Commits Futurs

### Format de commit recommandé

```bash
git add .
git commit -m "✨ Ajouter feature X"
git push
```

**Types de commits** :
- ✨ Nouvelle fonctionnalité : `✨ feat:`
- 🐛 Bug fix : `🐛 fix:`
- 📚 Documentation : `📚 docs:`
- 🎨 Style/UI : `🎨 style:`
- ♻️ Refactoring : `♻️ refactor:`
- ⚡ Performance : `⚡ perf:`
- ✅ Tests : `✅ test:`
- 🔧 Configuration : `🔧 config:`
- 🚀 Déploiement : `🚀 deploy:`

### Exemple complet

```bash
# Modifier du code
vim src/frontend/components/...

# Voir les changements
git status
git diff

# Ajouter et commit
git add .
git commit -m "✨ feat: Ajouter chat textuel entre participants"

# Push
git push
```

## 🚨 En cas d'erreur - Secrets Exposés

### Si vous avez accidentellement commit un .env :

**❌ NE PAS** simplement supprimer le fichier et commit
**✅ FAIRE** :

```bash
# Option 1 : Supprimer du dernier commit (si pas encore push)
git reset --soft HEAD~1
git restore --staged .env
git commit -m "Votre message"

# Option 2 : Si déjà push (DANGEREUX - à éviter)
# Contacter GitHub Support pour supprimer le repo
# Créer un nouveau repo
# Recommencer

# Option 3 : Nettoyer l'historique (COMPLEXE)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

**⚠️ SI SECRETS EXPOSÉS** :
1. REGÉNÉRER immédiatement tous les tokens/clés
2. SUPPRIMER le repository
3. CRÉER un nouveau repository propre
4. VÉRIFIER .gitignore avant de recommencer

## 🎯 Checklist Finale

Avant de push :
- [ ] `.env` dans `.gitignore` ✅
- [ ] Aucun mot de passe dans le code
- [ ] Aucune clé API en dur
- [ ] `.env.example` créé et documenté
- [ ] README.md à jour
- [ ] LICENSE ajouté
- [ ] `git status` vérifié (pas de fichiers sensibles)
- [ ] Test de build réussi (`npm run build`)

## 📧 Support

En cas de problème :
1. Vérifier ce guide
2. Lire SECURITY.md
3. Créer une issue sur GitHub
4. Contacter le mainteneur

---

**Bon upload ! 🚀**
