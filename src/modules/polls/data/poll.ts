import type { TextChannel } from "discord.js";

export interface PollData {
  authorId: string;

  question?: string;
  description?: string;

  options: PollOption[];

  channel?: TextChannel;

  anonymous: boolean;
  duration: string;
}

export interface PollOption {
  emoji?: string;
  description: string;
}
