import type { User } from "discord.js";
import logger from "../../../lib/logger.js";
import { declareService } from "../../../lib/service.js";
import type { PollData } from "../data/poll.js";

class PollCreationService {
  _polls: Map<string, PollData>;

  constructor() {
    this._polls = new Map<string, PollData>();
  }

  createPoll(user: User): PollData {
    if (this._polls.has(user.id)) {
      throw new Error("A poll is already being created by this user.");
    }

    const pollData: PollData = {
      authorId: user.id,
      options: [],
    };

    this._polls.set(user.id, pollData);
    return pollData;
  }

  getPoll(user: User): PollData | undefined {
    return this._polls.get(user.id);
  }

  getOrCreatePoll(user: User): PollData {
    if (this._polls.has(user.id)) {
      return this._polls.get(user.id)!;
    }

    try {
      return this.createPoll(user);
    } catch (error) {
      logger.error(`Failed to create poll for user ${user.id}: ${error}`);
      throw error;
    }
  }

  edit(user: User, updater: (pollData: PollData) => PollData): PollData {
    const pollData = this.getPoll(user);
    if (!pollData) {
      throw new Error("No poll data found for this user.");
    }

    logger.debug(
      `Editing poll for user ${user.id} | pollData: ${JSON.stringify(pollData)}`
    );
    const updatedPollData = updater(pollData);
    logger.debug(
      `Updated poll data for user ${user.id} | newPollData: ${JSON.stringify(updatedPollData)}`
    );
    this._polls.set(user.id, updatedPollData);

    return updatedPollData;
  }

  clear() {
    this._polls.clear();
  }
}

export default declareService(new PollCreationService());
