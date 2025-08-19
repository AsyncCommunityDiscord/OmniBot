# Guide des Listeners

Les listeners (écouteurs d'événements) dans AsyncMod permettent à votre module de réagir aux événements Discord. Le
système de modules gère automatiquement l'activation/désactivation des listeners selon l'état du module.

> ⚠️ **Important**: Pour les événements pouvant se produire en MP (messages privés), vous devez gérer manuellement la
> vérification d'activation du module car le système ne peut pas détecter automatiquement si le module est actif en
> dehors d'un serveur.

> 📋 **Intents Discord**: Assurez-vous d'ajouter les bons intents dans votre configuration Discord pour recevoir les
> événements souhaités.

## API des Listeners

### Déclaration d'un Listener

```typescript
import { declareEventListener } from "../../../lib/listener.js";

export default declareEventListener({
  eventType: "messageCreate", // Type d'événement Discord

  async execute(...args) {
    // Votre logique ici
    // Les arguments dépendent du type d'événement
  },
});
```

### Enregistrement dans le Module

```typescript
// src/modules/mon-module/mon-module.module.ts
import messageListener from "./listeners/message-create.listener.js";

export default defineModule({
  onLoad(client, registry) {
    // Le système gère automatiquement l'activation/désactivation
    registry.registerEventListener(messageListener);
  },
});
```

## Configuration des Intents Discord

Les intents sont requis pour recevoir certains événements.
Pour plus d'informations sur quels intents sont nécessaires pour chaque événement, consultez
la [documentation Discord](https://discord.com/developers/docs/events/gateway#list-of-intents).

## Prochaines Étapes

- [Configuration des Modules](./modules.md) pour gérer les paramètres
- [Gestion de la BDD](./prisma.md) pour les données persistantes
