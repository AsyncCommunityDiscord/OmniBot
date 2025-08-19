# Commandes Discord

Ce guide explique comment créer des commandes Discord dans vos modules.

> ⚠️ **Important**: Pour les commandes pouvant être exécutées en MP (messages privés), vous devez gérer manuellement la
> vérification d'activation du module car le système ne peut pas détecter automatiquement si le module est actif en
> dehors d'un serveur.

## Structure des Commandes

Les commandes Discord sont des interactions slash ("/") que les utilisateurs peuvent exécuter. Chaque commande doit être
définie dans un fichier séparé dans le dossier `commands/` de votre module.

### Structure de fichier

```
src/modules/mon-module/
├── module.ts
└── commands/
    └── ma-commande.command.ts
```

## Création d'une Commande

```typescript
// src/modules/mon-module/commands/test.command.ts
import { SlashCommandBuilder } from "discord.js";
import { declareCommand } from "../../../lib/command.js";

export default declareCommand({
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Commande de test"),

  async execute(interaction) {
    await interaction.reply("Test !");
  },
});
```

## Interface Command

La fonction `declareCommand` accepte un objet qui implémente l'interface `Command` :

- `data` : Configuration de la commande (SlashCommandBuilder)
- `execute` : Fonction d'exécution (obligatoire)
- `complete` : Fonction d'autocomplétion (optionnelle)

## Enregistrement dans le Module

```typescript
// src/modules/mon-module/mon-module.module.ts
import messageListener from "./commands/test.command.js";

export default defineModule({
  onLoad(client, registry) {
    // Le système gère automatiquement l'enregistrement et la désactivation des commandes
    registry.registerCommand(testCommand);
  },
});
```
