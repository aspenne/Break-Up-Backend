# BreakUp Backend

API AdonisJS pour l'application mobile BreakUp. Gère l'authentification, la persistance des données, et la logique métier.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Installation

```bash
cd backend
npm install
```

### Setup base de données

```bash
# Créer la base de données
createdb breakup_dev

# Lancer les migrations
npm run migration:run
```

### Développement

```bash
# Démarrer le serveur en mode dev avec HMR
npm run dev

# Ou manuellement
node ace serve --hmr
```

Le serveur écoute sur `http://localhost:3333`.

## 📦 Structure du projet

```
backend/
├── app/
│   ├── controllers/      # Logique des endpoints
│   ├── models/          # Modèles Lucid (ORM)
│   ├── middleware/       # Middleware Auth, etc.
│   ├── validators/       # Validation des requêtes
│   └── services/         # Services métier
├── database/
│   ├── migrations/       # Migrations SQL
│   └── seeders/         # Données de test
├── routes/              # Définition des routes
├── config/              # Configuration (database, auth, etc.)
├── start/               # Bootstrap files
└── package.json
```

## 🔧 Stack technique

- **AdonisJS 6** - Framework web TypeScript pour Node
- **Lucid ORM** - Object-Relational Mapping
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Token-based authentication
- **Resend** - Email service
- **TypeScript** - Type safety

## 🗄️ Base de données

### Principales entités

**users**
- id, email, password, firstName, lastName, avatarEmoji, breakupDate
- created_at, updated_at

**journal_entries**
- id, userId, emotion, title, content, promptQuestion, stage
- created_at, updated_at

**chat_rooms**
- id, name, theme, isDirect, creatorId
- created_at, updated_at

**chat_messages**
- id, roomId, userId, content
- created_at, updated_at

**chat_participants**
- roomId, userId, joinedAt

**blog_articles**
- id, title, excerpt, content, category, readTimeMinutes
- publishedAt, created_at, updated_at

**saved_articles** (favoris)
- userId, articleId
- created_at

### Voir migrations pour schéma complet

```bash
ls database/migrations/
```

## 🔐 Authentification

### Flows

**Register**
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "secure_password",
  "firstName": "John"
}
```

**Login**
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

Retourne :
```json
{
  "accessToken": "jwt...",
  "refreshToken": "jwt...",
  "user": { "id", "email", "firstName", ... }
}
```

**Refresh Token**
```bash
POST /api/auth/refresh
```

### Password Reset

**Demander reset**
```bash
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}
```
Envoie un email avec un code de réinitialisation (Resend API).

**Vérifier code**
```bash
POST /api/auth/verify-reset-code
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Réinitialiser password**
```bash
POST /api/auth/reset-password
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "new_secure_password"
}
```

## 📡 Endpoints principaux

### Auth
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Renouveler access token
- `POST /api/auth/forgot-password` - Demander reset
- `POST /api/auth/verify-reset-code` - Vérifier code reset
- `POST /api/auth/reset-password` - Réinitialiser password
- `POST /api/auth/logout` - Déconnexion

### Users
- `GET /api/users/me` - Profil utilisateur (authentifié)
- `PATCH /api/users/me` - Mettre à jour profil (firstName, lastName, avatarEmoji, breakupDate)

### Journal
- `GET /api/journal/entries` - Liste des entrées (paginée)
- `POST /api/journal/entries` - Créer une entrée
- `GET /api/journal/entries/:id` - Détail d'une entrée
- `PATCH /api/journal/entries/:id` - Mettre à jour une entrée
- `DELETE /api/journal/entries/:id` - Supprimer une entrée
- `GET /api/journal/prompts` - Liste des prompts (filtrés par daysSince breakup)

### Chat
- `GET /api/chat/rooms` - Liste des salons (publics + joinés)
- `POST /api/chat/rooms` - Créer un salon
- `POST /api/chat/rooms/:id/join` - Rejoindre un salon
- `GET /api/chat/rooms/:id/messages` - Messages du salon (paginés)
- `POST /api/chat/rooms/:id/messages` - Poster un message
- `DELETE /api/chat/messages/:id` - Supprimer un message

### Blog
- `GET /api/blog/articles` - Liste des articles
- `GET /api/blog/articles/:id` - Détail d'un article
- `GET /api/blog/articles/favorites` - Mes articles favoris
- `POST /api/blog/articles/:id/favorite` - Ajouter aux favoris
- `DELETE /api/blog/articles/:id/favorite` - Retirer des favoris

## 🔑 Variables d'environnement

Créer un fichier `.env` à la racine du backend :

```env
NODE_ENV=development
APP_KEY=xxxxx (généré avec `node ace generate:key`)
PORT=3333

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_DATABASE=breakup_dev

# Resend (Email)
RESEND_API_KEY=your_resend_key

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d
```

## 🚀 Migrations

```bash
# Créer une migration
node ace make:migration create_users_table

# Lancer les migrations
npm run migration:run

# Rollback dernière migration
npm run migration:rollback

# Rollback tout
npm run migration:refresh
```

## 📧 Email (Resend)

Configuration dans `config/mail.ts`. En développement, les emails sont loggés dans la console.

Pour tester avec un vrai email, utiliser un compte Resend avec domaine configuré.

## 🧪 Tests

```bash
npm run test
npm run test:watch
```

## 🔒 Middleware

- **Auth** - Vérification JWT pour routes protégées
- **CORS** - Accepte requests du frontend Expo
- **Rate Limiting** - Protection contre abus

## 📝 Logging

En mode dev, logs détaillés sur stdout. En production, format JSON.

Pour debug avancé :
```bash
LOG_LEVEL=debug npm run dev
```

## 🚀 Déploiement

L'API peut être déployée sur :
- **Railway** (PostgreSQL + Node app)
- **Render**
- **Heroku**
- **Vercel** (avec serverless functions)

## 🤝 Contribution

- Code TypeScript avec types explicites
- Respects AdonisJS conventions
- Migrations pour tout changement DB
- Tests pour features critiques

## 📚 Ressources

- [AdonisJS Docs](https://docs.adonisjs.com/)
- [Lucid ORM Docs](https://docs.adonisjs.com/guides/database/orm)
- [Resend Docs](https://resend.com/docs)
- [JWT Docs](https://jwt.io/)
