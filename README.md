# MediNotes

Application de suivi des symptômes pour patients et médecins, développée avec Angular (standalone components, Signals) et Tailwind CSS.

## 🚀 Démarrage rapide

Prérequis: Node 20+, npm

```bash
npm install
npm start    # démarre sur http://localhost:4200/
```

Comptes utiles:
- Admin par défaut: `admin@medinotes.com` / `admin1234`
- Vous pouvez créer un compte patient via `/auth/inscription`.

Assurez‑vous que le composant racine contient `<router-outlet>` (déjà fait dans `app.component.ts`).

## ✨ Fonctionnalités principales

- Authentification complète (inscription, login, persistance, logout)
- Autorisation par rôles et Guards (`authGuard`, `adminGuard`)
- CRUD symptômes (patient): créer, lister, modifier, supprimer
- Signals + Computed + Effects pour l’état réactif et la persistance
- Validation réactive des formulaires (validators custom)
- Pipes et directives custom (`graviteLabel`, `roleLabel`, `appHighlight`)
- Notifications de succès/erreur + indicateurs de chargement
- UI responsive (Tailwind), accessibilité de base (ARIA/roles)

## 🧭 Parcours utilisateur

- Patient
  - Se connecter → bouton “Gérer mes symptômes” (`/symptomes`)
  - Ajouter/éditer/supprimer un symptôme (validation immédiate)
  - Les stats par gravité se mettent à jour en temps réel
- Médecin
  - Se connecter → bouton “Accéder au suivi” (`/suivi`)
  - Voir la liste des patients (dérivée des symptômes saisis)
  - Accéder au détail: `/suivi/patient/:id` (liste des symptômes du patient)

## 🧩 Architecture

Organisation par domaines (DDD simplifié):
- `src/app/features/` → fonctionnalités (auth, symptomes, accueil)
- `src/app/shared/` → éléments réutilisables (pipes, directives, validators)
- `src/app/core/` → services transverses (interceptors, notifications, guards)

Routing:
- `src/app/app.routes.ts` → routes principales + guards + lazy loading d’auth
- `src/app/features/auth/auth.routes.ts` → routes d’auth (connexion/inscription)

Entrée de l’app:
- `src/main.ts` → bootstrap avec `app.config.ts`
- `src/app/app.component.ts` → layout (header, bouton déconnexion) + `<router-outlet>`

## 🔐 Sécurité & Rôles

- `authGuard` bloque l’accès si non connecté et redirige vers `/auth/connexion` (avec `returnUrl`)
- `adminGuard` autorise seulement le rôle `medecin`, sinon redirige `/accueil`
- Navigation conditionnelle selon le rôle dans `AccueilComponent`

## 🗃️ Gestion d’état & Persistance

- Signals:
  - `AuthService.utilisateurCourant` (session)
  - `SymptomesService.symptomes` (symptômes globaux)
- Effects:
  - Persistance automatique de la session dans `localStorage`
- Persistance:
  - Utilisateurs (liste) et symptômes stockés en `localStorage`

## 🧪 Qualité technique

Scripts npm:
```bash
npm start       # ng serve
npm run build  # ng build
npm test       # ng test (Karma)
npm run lint   # ng lint (ESLint)
```

État actuel (référence):
- Tests: passent ✅
- Lint: OK ✅
- Build: OK ✅

## 🧰 Détails Techniques clés

- Authentification: `src/app/features/auth/auth.service.ts`
  - Persistance de la session par `effect()` → clé `medinotes.utilisateur`
  - Persistance de la liste des utilisateurs → clé `medinotes.utilisateurs`
  - Déconnexion: reset du signal + redirection immédiate vers `/auth/connexion`
- Symptômes: `src/app/features/symptomes/symptomes.service.ts`
  - CRUD complet + stockage `medinotes.symptomes`
  - `computed()` pour stats patient côté UI
- UI & UX:
  - Tailwind pour le responsive (`src/styles.css`, `tailwind.config.js`)
  - Notifications via `core/notifications`
  - Accessibilité: attributs ARIA de base

## 🔎 Démo guidée 

1) Authentification (inscription, login OK/KO, persistance, logout)
2) Guards & rôles (authGuard, adminGuard, menu dynamique)
3) Métier (CRUD symptômes, validations temps réel, pipes, directives)
4) État & performance (signals/computed/effect, loading states)
5) UI & Accessibilité (responsive, feedback clair)
6) Qualité (console propre, tests, lint, build)


Projet pédagogique. Utilisation libre à des fins d’apprentissage.
