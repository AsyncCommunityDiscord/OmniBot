import type { ClientEvents } from "discord.js";
import { DeclarationType, type Declared } from "./declared.js";

/**
 * Represents a listener
 */
export interface EventListener<T extends keyof ClientEvents> {
  /**
   * The type of the event listener, which corresponds to a key in ClientEvents.
   */
  eventType: T;

  /**
   * The function to execute when the event is triggered.
   *
   * @param event The event data that triggered the listener.
   * @returns A promise that resolves when the listener has finished executing.
   */
  execute: (...args: ClientEvents[T]) => Promise<void>;
}

/**
 * Declares a command for dynamic import.
 *
 * @param listener The event listener to declare.
 */
export function declareEventListener<T extends keyof ClientEvents>(
  listener: EventListener<T>
): Declared<EventListener<T>> {
  return {
    type: DeclarationType.Listener,
    eventType: listener.eventType,
    execute: listener.execute,
  };
}
