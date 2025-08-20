import { defineModule } from "../../lib/module.js";
import pollCommand from "./commands/poll.command.js";
import pollCreationService from "./services/poll-creation.service.js";

export default defineModule({
  id: "polls",
  name: "Polls",
  description: "Create and manage polls.",
  version: "0.0.1",
  author: "RedsTom",
  intents: [],
  onLoad(_, registry) {
    registry.registerCommand(pollCommand);
  },
  onInstall() {},
  onUninstall() {
    pollCreationService.clear();
  },
});
