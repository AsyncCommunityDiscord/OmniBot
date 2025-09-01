# Guide des Interactions Discord

Les interactions Discord permettent à votre module de réagir aux interactions des utilisateurs avec des composants UI comme les boutons, menus déroulants et modales. Ce système complète les commandes slash et les listeners d'événements.

## Types d'Interactions Supportées

AsyncMod supporte deux types d'interactions :

- **Message Component Interactions** : Boutons, menus déroulants, etc.
- **Modal Submit Interactions** : Soumissions de formulaires modaux

## Structure des Interactions

### Structure de fichier

```
src/modules/mon-module/
├── module.ts
├── commands/
│   └── ma-commande.command.ts
└── interactions/
    ├── mon-bouton.button.ts
    ├── mon-menu.select.ts
    └── ma-modale.modal.ts
```

## API des Interactions

### Interface InteractionHandler

```typescript
export interface InteractionHandler<T extends CompatibleInteraction> {
  customId: string; // Identifiant unique
  check: (interaction: CompatibleInteraction) => interaction is T; // Vérification du type
  execute: (interaction: T, args: string[]) => Promise<void>; // Fonction d'exécution
}
```

## Création d'une Interaction

### Exemple : Bouton

```typescript
// src/modules/mon-module/interactions/confirm.button.ts
import { MessageFlags } from "discord.js";
import { declareInteractionHandler } from "../../../lib/interaction.js";

export default declareInteractionHandler({
  customId: "confirm-action",
  check: (interaction) => interaction.isButton(),

  async execute(interaction, [actionId, userId]) {
    await interaction.reply({
      content: `Action ${actionId} confirmée pour l'utilisateur ${userId}`,
      flags: MessageFlags.Ephemeral,
    });
  },
});
```

### Exemple : Menu Déroulant

```typescript
// src/modules/mon-module/interactions/role-select.select.ts
import { declareInteractionHandler } from "../../../lib/interaction.js";

export default declareInteractionHandler({
  customId: "role-select",
  check: (interaction) => interaction.isStringSelectMenu(),

  async execute(interaction, [targetUserId]) {
    const selectedRoles = interaction.values;

    await interaction.reply({
      content: `Rôles ${selectedRoles.join(", ")} attribués à <@${targetUserId}>`,
      ephemeral: true,
    });
  },
});
```

### Exemple : Modal

```typescript
// src/modules/mon-module/interactions/feedback.modal.ts
import { declareInteractionHandler } from "../../../lib/interaction.js";

export default declareInteractionHandler({
  customId: "feedback-modal",
  check: (interaction) => interaction.isModalSubmit(),

  async execute(interaction, [category]) {
    const feedback = interaction.fields.getTextInputValue("feedback-input");

    // Traitement du feedback
    console.log(`Feedback reçu (${category}): ${feedback}`);

    await interaction.reply({
      content: "Merci pour votre retour !",
      ephemeral: true,
    });
  },
});
```

## Système de Custom ID avec Arguments

Le système AsyncMod permet de passer des arguments via le `customId` :

```
customId:arg1:arg2:arg3
```

### Utilisation dans une commande

```typescript
// Dans une commande qui crée un bouton
const button = new ButtonBuilder()
  .setCustomId(`confirm-action:delete:${userId}`)
  .setLabel("Confirmer")
  .setStyle(ButtonStyle.Danger);
```

## Enregistrement dans le Module

```typescript
// src/modules/mon-module/mon-module.module.ts
import confirmButton from "./interactions/confirm.button.js";
import roleSelect from "./interactions/role-select.select.js
";

export default defineModule({
  onLoad(client, registry) {
    registry.register(confirmButton);
    registry.register(roleSelect);
  },
});
```

## Gestion Automatique de l'Activation

Le système AsyncMod gère automatiquement l'activation/désactivation des interactions :

- ✅ Les interactions ne fonctionnent que si le module est activé sur le serveur
- ✅ Pas de code supplémentaire nécessaire pour vérifier l'état
- ✅ Messages d'erreur automatiques si le module est désactivé

## Bonnes Pratiques

### 1. Validation des Arguments

```typescript
async execute(interaction, [userId, action]) {
  if (!userId || !action) {
    await interaction.reply({
      content: "Données manquantes. Veuillez réessayer.",
      ephemeral: true,
    });
    return;
  }
  // Logique principale
}
```

### 2. Gestion des Erreurs

```typescript
async execute(interaction, [targetId]) {
  try {
    await performRiskyOperation(targetId);
    await interaction.reply({ content: "Opération réussie !", ephemeral: true });
  } catch (error) {
    console.error("Erreur:", error);
    await interaction.reply({
      content: "Une erreur s'est produite. Veuillez réessayer.",
      ephemeral: true,
    });
  }
}
```

### 3. Types de Réponses

```typescript
// Action instantanée
await interaction.reply({ content: "Fait !", ephemeral: true });

// Action longue
await interaction.deferReply({ ephemeral: true });
await longOperation();
await interaction.editReply({ content: "Terminé !" });

// Mise à jour du message (boutons)
await interaction.update({ content: "Mis à jour", components: [] });
```

## Prochaines Étapes

- [Configuration des Modules](./modules.md) pour gérer les paramètres
- [Commandes Discord](./commands.md) pour créer des commandes slash
- [Guide des Listeners](./listeners.md) pour réagir aux événements
