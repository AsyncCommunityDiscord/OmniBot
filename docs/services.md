# Services

Ce guide explique comment créer des services dans vos modules pour organiser la logique métier.

## Structure des Services

Les services permettent d'encapsuler la logique métier et de la réutiliser à travers votre module. Chaque service doit
être défini dans un fichier séparé dans le dossier `services/` de votre module.

### Structure de fichier

```
src/modules/mon-module/
├── mon-module.module.ts
└── services/
    └── mon-service.service.ts
```

## Création d'un Service

```typescript
// src/modules/mon-module/services/user.service.ts
import { declareService, type Service } from "../../../lib/service.js";
import prisma from "../../../lib/database.js";

class UserService implements Service {
  async createUser(userId: string, username: string) {
    return await prisma.user.create({
      data: { userId, username },
    });
  }

  async getUser(userId: string) {
    return await prisma.user.findUnique({
      where: { userId },
    });
  }
}

export default declareService(new UserService());
```

## Interface Service

La fonction `declareService` accepte une instance de classe qui implémente l'interface `Service`. L'interface est
actuellement vide, permettant une grande flexibilité dans la structure de vos services.

## Utilisation

Les services peuvent être importés et utilisés dans vos commandes, listeners ou autres services :

```typescript
// Dans une commande
import userService from "../services/user.service.js";

async;
execute(interaction);
{
  const user = await userService.getUser(interaction.user.id);
  // ...
}
```

## Bonnes Pratiques

- Utilisez les services pour encapsuler la logique métier
- Gardez les services focalisés sur une responsabilité spécifique
- Utilisez les services pour les interactions avec la base de données
- Exportez toujours une instance déclarée avec `declareService`
