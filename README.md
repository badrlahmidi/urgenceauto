# Urgence Auto Marrakech 🚗🔧

Plateforme SaaS de mise en relation entre les conducteurs et les professionnels de l'automobile (mécaniciens, dépanneurs, électriciens) à Marrakech.

## 🚀 Stack Technique

- **Framework :** Next.js 14 (App Router)
- **Base de données :** PostgreSQL (via Supabase)
- **ORM :** Prisma
- **Authentification :** NextAuth.js (Auth.js v5)
- **Stockage Images :** Supabase Storage
- **UI / CSS :** Tailwind CSS + shadcn/ui
- **Internationalisation :** `next-intl` (Support natif Bilingue: Français LTR / Arabe RTL)

---

## 🛠️ Guide de Déploiement Complet (Vercel + Supabase)

Suivez ces étapes dans l'ordre pour déployer l'application en production.

### Étape 1 : Préparation de la Base de Données (Supabase)

1. Connectez-vous à votre tableau de bord [Supabase](https://supabase.com).
2. Ouvrez votre projet `tshwqgfgmzayiphvtpgl`.
3. Allez dans **Project Settings > Database**.
4. Copiez la **Connection string** (URI) pour PostgreSQL.
   - *Assurez-vous de remplacer `[YOUR-PASSWORD]` par votre vrai mot de passe de base de données.*
   - *Ajoutez `?pgbouncer=true&connection_limit=1` à la fin de l'URL si vous utilisez l'URL de pooler pour les environnements serverless.*

### Étape 2 : Création du Bucket de Stockage (Supabase)

Pour que les professionnels puissent ajouter des images à leur portfolio :
1. Dans Supabase, allez dans le menu **Storage**.
2. Cliquez sur **New Bucket**.
3. Nommez le bucket exactement **`portfolios`**.
4. **Très Important :** Cochez la case **"Public bucket"** (cela permet d'afficher les images sur le site sans token d'autorisation).
5. Sauvegardez.

### Étape 3 : Déploiement sur Vercel

1. Connectez-vous à [Vercel](https://vercel.com) avec votre compte GitHub.
2. Cliquez sur **Add New... > Project**.
3. Importez ce repository GitHub (`urgenceauto`).
4. Dans la section **Environment Variables**, ajoutez les clés suivantes :

| Clé | Valeur | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.[ref]:[mdp]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | L'URL de connexion copiée à l'Étape 1. |
| `DIRECT_URL` | `postgresql://postgres.[ref]:[mdp]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres` | L'URL directe pour Prisma Migrate. |
| `AUTH_SECRET` | `(générer une chaîne aléatoire longue)` | Clé pour crypter les sessions NextAuth. Générez-en une via un générateur de mot de passe. |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tshwqgfgmzayiphvtpgl.supabase.co` | L'URL de votre API Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhb...` (votre clé longue fournie) | La clé anonyme publique Supabase. |
| `ADMIN_PASSWORD` | `votre_mot_de_passe_secret` | Le mot de passe de votre futur compte Admin par défaut. |
| `ADMIN_PHONE` | `0600000000` | Votre numéro de téléphone Admin. |

5. Cliquez sur **Deploy**.
6. *Note :* Le build exécutera automatiquement `prisma generate` grâce au script `postinstall` configuré dans le `package.json`.

### Étape 4 : Initialisation de la Base de Données (Migration & Seed)

Une fois l'application déployée sur Vercel, les tables dans Supabase sont encore vides. Il faut pousser le schéma Prisma et exécuter le seed (catégories + admin).

Depuis votre terminal local, à la racine du projet :

1. Remplacez le contenu de votre `.env` local temporairement par vos identifiants de production :
   ```env
   DATABASE_URL="votre_url_supabase"
   ```
2. Poussez le schéma vers la base de données :
   ```bash
   npx prisma db push
   ```
3. Exécutez le script de Seed (qui créera les 10 catégories de Marrakech et votre compte Admin) :
   ```bash
   npx prisma db seed
   ```

### 🎉 Étape 5 : Lancement

Rendez-vous sur l'URL fournie par Vercel (ex: `https://urgenceauto.vercel.app/fr/login`).
Connectez-vous avec :
- **Téléphone :** Le numéro défini dans `ADMIN_PHONE`
- **Mot de passe :** Celui défini dans `ADMIN_PASSWORD`

Vous aurez ainsi accès au panneau d'administration pour valider vos premiers professionnels !

---

*Développé pour simplifier l'assistance routière à Marrakech.* 🌴
