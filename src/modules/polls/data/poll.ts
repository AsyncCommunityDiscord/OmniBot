export interface PollData {
  authorId: string;

  question?: string;
  description?: string;

  options: PollOption[];

  channelId?: string;
}

export interface PollOption {
  emoji?: string;
  description: string;
}
