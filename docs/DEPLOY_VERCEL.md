# Déploiement Frontend sur Vercel - GRATUIT ∞

## Pourquoi Vercel ?

- ✅ **100% GRATUIT** pour toujours
- ✅ Déploiement automatique depuis GitHub
- ✅ SSL/TLS automatique
- ✅ CDN global ultra-rapide
- ✅ Domaine gratuit `.vercel.app`
- ✅ Preview deployments pour chaque PR
- ✅ Analytics gratuits

## Prérequis

- Compte GitHub avec le repository `senegal-bus-platform`
- Node.js installé localement (pour test)

## Méthode 1: Via Interface Web (Recommandé - 5 min)

### Étape 1: Créer compte Vercel

1. Aller sur https://vercel.com
2. Cliquer **Sign Up**
3. Choisir **Continue with GitHub**
4. Autoriser Vercel à accéder à GitHub

### Étape 2: Importer le projet

1. Cliquer **Add New... → Project**
2. **Import Git Repository**
3. Chercher `senegal-bus-platform`
4. Cliquer **Import**

### Étape 3: Configurer le projet

**Framework Preset**: Next.js (auto-détecté)

**Root Directory**: `bus-senegal-frontend` ⚠️ IMPORTANT

**Build Settings**:
- Build Command: `npm run build` (auto)
- Output Directory: `.next` (auto)
- Install Command: `npm install` (auto)

### Étape 4: Variables d'environnement

Cliquer **Environment Variables** et ajouter :

```env
# NextAuth
NEXTAUTH_URL=https://bus-senegal.vercel.app
NEXTAUTH_SECRET=<générer-avec-openssl-rand-base64-32>

# Keycloak (à configurer après avoir Keycloak déployé)
KEYCLOAK_CLIENT_ID=bus-senegal-frontend
KEYCLOAK_CLIENT_SECRET=<secret-from-keycloak>
KEYCLOAK_ISSUER=https://<keycloak-url>/realms/bus-senegal

# Backend API (à configurer après avoir backend déployé)
NEXT_PUBLIC_API_URL=https://bus-senegal-backend.onrender.com
```

### Étape 5: Déployer

1. Cliquer **Deploy**
2. Attendre 2-3 minutes ⏳
3. **Success!** 🎉

### Étape 6: Accéder à l'application

URL: `https://bus-senegal-<random>.vercel.app`

Ou configurer domaine personnalisé (gratuit) :
- Settings → Domains → Add Domain
- Pointer DNS vers Vercel

## Méthode 2: Via CLI (Pour développeurs)

### Installation

```bash
npm install -g vercel
```

### Connexion

```bash
vercel login
# Suivre instructions pour lier GitHub
```

### Déploiement

```bash
cd /Users/diaguily/wokspace/sources/senegal_bus/bus-senegal-frontend

# Premier déploiement
vercel

# Déploiement production
vercel --prod
```

### Configuration interactive

```
? Set up and deploy "~/bus-senegal-frontend"? Yes
? Which scope do you want to deploy to? [Your Account]
? Link to existing project? No
? What's your project's name? bus-senegal
? In which directory is your code located? ./
? Want to modify these settings? No
```

### Variables d'environnement (CLI)

```bash
# Ajouter variables
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add KEYCLOAK_CLIENT_ID production
vercel env add KEYCLOAK_CLIENT_SECRET production
vercel env add KEYCLOAK_ISSUER production
vercel env add NEXT_PUBLIC_API_URL production

# Redéployer
vercel --prod
```

## Configuration Next.js pour Vercel

### Désactiver Standalone Output

Le Dockerfile utilise standalone mode. Pour Vercel, modifier `bus-senegal-frontend/next.config.js` :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // Commenter pour Vercel
}

module.exports = nextConfig
```

Ou créer `next.config.vercel.js` séparé.

## Post-Déploiement

### Vérifications

```bash
# Health check
curl https://bus-senegal.vercel.app

# Tester navigation
open https://bus-senegal.vercel.app
```

### Configuration Backend

Une fois le backend déployé, mettre à jour :

```bash
vercel env add NEXT_PUBLIC_API_URL production
# Valeur: https://bus-senegal-backend.onrender.com

vercel --prod  # Redéployer
```

## Domaine Personnalisé (Gratuit)

### Ajouter domaine

1. **Vercel Dashboard** → Votre projet → **Settings** → **Domains**
2. **Add Domain**: `bus-senegal.sn` ou `app.bus-senegal.sn`
3. Configurer DNS:

**Chez votre registrar** :
```
Type: A
Name: @  (ou app)
Value: 76.76.21.21
```

OU

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

4. Attendre propagation (5-60 min)
5. SSL automatique activé ! ✅

## Monitoring

### Vercel Analytics (Gratuit)

1. **Settings** → **Analytics** → **Enable**
2. Voir Web Vitals, trafic, erreurs
3. 100% gratuit

### Logs

```bash
# Voir logs temps réel
vercel logs
```

## Auto-Deploy depuis GitHub

**Déjà configuré automatiquement !**

- Push sur `main` → Deploy production
- Push sur `develop` → Deploy preview
- Ouvrir PR → Deploy preview

## Troubleshooting

### Build échoue

Vérifier :
- `package.json` scripts corrects
- Pas d'erreurs TypeScript : `npm run build` localement
- Variables d'environnement correctes

### Erreur au runtime

Vérifier :
- Logs dans Vercel Dashboard
- Variables d'environnement en production
- Backend accessible depuis Vercel

## Limites du Tier Gratuit

### Ce qui est INCLUS (Gratuit)
- ✅ Déploiements illimités
- ✅ Bandwidth 100GB/mois
- ✅ Serverless Functions 100GB-hrs
- ✅ Edge Middleware illimité
- ✅ CDN global
- ✅ SSL automatique
- ✅ Preview deployments
- ✅ Analytics

### Limites
- ⚠️ Build time: 6000 minutes/mois
- ⚠️ Bandwidth: 100GB/mois
- ⚠️ Serverless execution: 100GB-hrs
- ⚠️ 1 utilisateur (vous)

**Pour Bus Sénégal**: Largement suffisant ! 🎉

## Conclusion

**Frontend déployé en 5 minutes, GRATUITEMENT, POUR TOUJOURS !**

URL Production: `https://bus-senegal.vercel.app`

**Prochaine étape**: Déployer le Backend sur Render.com

