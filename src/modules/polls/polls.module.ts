import { defineModule } from "../../lib/module.js";
import pollCommand from "./commands/poll.command.js";
import addPollOptionButton from "./interactions/add-poll-option.button.js";
import addPollOptionModal from "./interactions/add-poll-option.modal.js";
import cancelEditOptionButton from "./interactions/cancel-edit-option.button.js";
import deletePollOptionModal from "./interactions/delete-poll-option-confirm.button.js";
import deletePollOptionButton from "./interactions/delete-poll-option.button.js";
import editPollOptionButton from "./interactions/edit-poll-option.button.js";
import editPollQuestionButton from "./interactions/edit-poll-question.button.js";
import editPollQuestionModal from "./interactions/edit-poll-question.modal.js";
import movePollOptionButton from "./interactions/move-poll-option.button.js";
import renamePollOptionButton from "./interactions/rename-poll-option.button.js";
import renamePollOptionModal from "./interactions/rename-poll-option.modal.js";
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

    [
      addPollOptionModal,
      addPollOptionButton,
      editPollQuestionModal,
      editPollQuestionButton,
      editPollOptionButton,
      cancelEditOptionButton,
      deletePollOptionButton,
      deletePollOptionModal,
      renamePollOptionButton,
      renamePollOptionModal,
      movePollOptionButton,
    ].forEach((interaction) =>
      registry.registerInteractionHandler(interaction)
    );
  },
  onInstall() {},
  onUninstall() {
    pollCreationService.clear();
  },
});
