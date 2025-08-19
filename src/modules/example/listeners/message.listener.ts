import { declareEventListener } from "../../../lib/listener.js";
import logger from "../../../lib/logger.js";

export default declareEventListener({
  eventType: "messageCreate",
  async execute(message) {
    logger.debug(`Message received: ${message.content}`);
  },
});
