# 🔒 Politique de Sécurité

## Versions Supportées

| Version | Support          |
| ------- | ---------------- |
| 1.0.x   | ✅ Support actif |

## Signaler une Vulnérabilité

Si vous découvrez une faille de sécurité, **NE PAS** créer une issue publique.

### Procédure de signalement

1. **Email** : Envoyez les détails à [votre-email@example.com]
2. **Informations à inclure** :
   - Description de la vulnérabilité
   - Étapes pour la reproduire
   - Impact potentiel
   - Suggestion de correction (optionnel)

### Délais de réponse

- **Accusé de réception** : 48 heures
- **Évaluation initiale** : 7 jours
- **Correction** : 30 jours (selon gravité)

## Bonnes Pratiques de Sécurité

### Pour les Développeurs

1. **Jamais committer** :
   - Fichiers `.env`
   - Clés API
   - Tokens
   - Mots de passe
   - Certificats SSL

2. **Toujours utiliser** :
   - Variables d'environnement
   - `.env.example` pour la documentation
   - Secrets managers en production

3. **Vérifications** :
   ```bash
   # Vérifier qu'aucun secret n'est committé
   git log -p | grep -i "password\|secret\|key\|token"
   ```

### Pour les Déploiements

1. **HTTPS obligatoire** en production
   - Let's Encrypt pour SSL gratuit
   - `getDisplayMedia` ne fonctionne qu'en HTTPS

2. **Firewall** :
   ```bash
   # Autoriser seulement les ports nécessaires
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 3001/tcp  # WebSocket (peut être en interne seulement)
   ufw enable
   ```

3. **Headers de sécurité** :
   - ✅ Déjà configurés dans `nginx.conf`
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection

4. **CORS** :
   - Configurer les origines autorisées
   - Ne pas utiliser `*` en production

5. **Rate Limiting** :
   - Implémenter dans nginx ou le serveur
   - Prévient les attaques DDoS

### WebRTC Sécurité

- ✅ **DTLS** : Chiffrement automatique (WebRTC)
- ✅ **SRTP** : Audio/Vidéo chiffré (WebRTC)
- ⚠️ **TURN/STUN** : Utiliser vos propres serveurs en production
- ⚠️ **Salles** : Codes aléatoires (améliorer avec tokens JWT)

## Audits de Sécurité

### Recommandations

1. **Dépendances** :
   ```bash
   npm audit
   npm audit fix
   ```

2. **Docker** :
   ```bash
   docker scan screen-share-frontend
   docker scan screen-share-signaling
   ```

3. **Code** :
   - Utiliser ESLint avec règles de sécurité
   - Analyser avec SonarQube ou similaire

## Limites Connues

1. **Pas d'authentification** (v1.0)
   - Les salles sont publiques avec code
   - À implémenter : JWT, OAuth2

2. **Pas de chiffrement E2E** supplémentaire
   - WebRTC utilise DTLS/SRTP (suffisant)
   - À implémenter : Chiffrement additionnel si nécessaire

3. **STUN/TURN publics**
   - Utilise Google STUN (peut exposer IP)
   - À implémenter : Serveurs TURN privés

## Checklist de Sécurité Pré-Déploiement

- [ ] Fichiers `.env` dans `.gitignore`
- [ ] HTTPS activé
- [ ] CORS configuré (pas de `*`)
- [ ] Firewall activé
- [ ] Headers de sécurité configurés
- [ ] `npm audit` passé
- [ ] Dépendances à jour
- [ ] Secrets dans variables d'environnement
- [ ] Backups configurés
- [ ] Monitoring activé
- [ ] Rate limiting configuré
- [ ] Logs sécurisés (pas de données sensibles)

## Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [WebRTC Security](https://webrtc-security.github.io/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Nginx Security](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)

## Mises à Jour de Sécurité

Les correctifs de sécurité seront publiés dès que possible et annoncés via :
- GitHub Releases
- Security Advisories
- CHANGELOG.md

---

**Date de dernière révision** : 2026-01-09
