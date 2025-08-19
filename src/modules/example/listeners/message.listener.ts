import { declareEventListener } from "../../../lib/listener.js";
import logger from "../../../lib/logger.js";

export default declareEventListener({
  eventType: "messageCreate",
  async execute(...args) {
    logger.debug(args);
  },
});
