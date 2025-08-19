# Configuration Prisma - AsyncMod

## Vue d'ensemble

Ce projet utilise Prisma comme ORM avec une architecture modulaire personnalisée qui permet de distribuer les modèles de
base de données à travers différents modules tout en maintenant un schéma consolidé.

## Architecture

### Structure des fichiers

```
src/
├── prisma/
│   ├── header.prisma          # Configuration du générateur et datasource
│   └── schema.prisma          # Schéma consolidé (généré automatiquement)
├── core/
│   └── models/
│       └── modules.prisma     # Modèles du système de modules
└── modules/
    └── [module-name]/
        └── models/
            └── *.prisma       # Modèles spécifiques au module
```

### Configuration

#### dbinfo.prisma

Le fichier `dbinfo.prisma` contient la configuration de base qui sera utilisée pour tous les schémas consolidés :

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Avantages de cette approche :**

- Configuration centralisée et modifiable
- Possibilité de changer facilement la base de données ou les options du générateur
- Séparation claire entre configuration et modèles

## Système de consolidation des modèles

### Principe

Au lieu d'avoir tous les modèles dans un seul fichier `schema.prisma`, ce projet permet de distribuer les modèles dans
différents fichiers `.prisma` à travers les modules. Un script de consolidation (`scripts/consolidate-schema.ts`)
rassemble automatiquement tous ces modèles avec le header dans le schéma principal.

### Script de consolidation

Le script `consolidate-schema.ts` :

1. **Recherche récursive** : Parcourt tous les dossiers dans `src/` pour trouver les fichiers `.prisma` (sauf
   dans le dossier `src/prisma/`)
2. **Consolidation** : Combine le header et tous les modèles trouvés dans un seul `schema.prisma`
3. **Organisation** : Ajoute des commentaires pour identifier la source de chaque modèle

## Scripts NPM

Le projet fournit plusieurs scripts pour faciliter le travail avec Prisma :

```json
{
  "prisma:consolidate": "node --loader ts-node/esm scripts/consolidate-schema.ts",
  "prisma:generate": "pnpm prisma:consolidate && prisma generate",
  "prisma:migrate": "pnpm prisma:consolidate && prisma migrate dev",
  "prisma:studio": "pnpm prisma:consolidate && prisma studio"
}
```

### Description des scripts

- **`prisma:consolidate`** : Exécute uniquement la consolidation des modèles
- **`prisma:generate`** : Consolide puis génère le client Prisma
- **`prisma:migrate`** : Consolide puis crée/applique les migrations
- **`prisma:studio`** : Consolide puis lance Prisma Studio

## Workflow de développement

### 1. Ajouter un nouveau modèle

1. Créer un fichier `.prisma` dans le dossier `models/` de votre module :

   ```
   src/modules/mon-module/models/mon-modele.prisma
   ```

2. Définir votre modèle :
   ```prisma
   model MonModele {
     id String @id @default(cuid())
     nom String
     // ... autres champs
   }
   ```

### 2. Générer le client

```bash
pnpm prisma:generate
```

Cette commande :

1. Consolide tous les modèles
2. Génère le client TypeScript typé

### 3. Créer une migration

```bash
pnpm prisma:migrate
```

Cette commande :

1. Consolide tous les modèles
2. Crée une nouvelle migration
3. L'applique à la base de données

## Bonnes pratiques

### Organisation des modèles

- **Modèles du core** : `src/core/models/`
- **Modèles spécifiques aux modules** : `src/modules/[module-name]/models/`
- **Réduire le nombre de modèles par fichier** : Facilite la maintenance et la lecture

### Nommage

- **Fichiers** : `nom-descriptif.prisma`
- **Modèles** : PascalCase (ex: `ModuleActivation`)
- **Champs** : camelCase (ex: `moduleId`)

## Dépannage

### Erreur de consolidation

Si le script de consolidation échoue :

1. Vérifiez la syntaxe Prisma de tous vos fichiers `.prisma`
2. Assurez-vous qu'il n'y a pas de conflits de noms de modèles
3. Vérifiez les permissions de fichiers

### Erreur de génération

Si `prisma generate` échoue après consolidation :

1. Vérifiez le fichier `schema.prisma` généré
2. Recherchez les erreurs de syntaxe ou de relations
3. Assurez-vous que toutes les relations sont valides

### Problèmes de migration

En cas de problème avec les migrations :

1. Vérifiez que votre base de données est accessible
2. Assurez-vous que `DATABASE_URL` est correctement configurée
3. Consultez les logs de migration pour plus de détails

## Variables d'environnement

Assurez-vous d'avoir configuré dans votre fichier `.env` :

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

## Ressources utiles

- [Documentation Prisma](https://www.prisma.io/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
