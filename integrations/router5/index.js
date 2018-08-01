"use strict";

const logger = require("logtown").getLogger("router5");

function logtownPlugin() {

  logger.info("Router started");

  return {
    onStop() {
      logger.info("Router stopped");
    },
    onTransitionStart(toState, fromState) {
      logger.debug("Transition started from state");
      logger.debug(fromState);
      logger.debug("To state");
      logger.debug(toState);
    },
    onTransitionCancel() {
      logger.warn("Transition cancelled");
    },
    onTransitionError(toState, fromState, err) {
      logger.warn("Transition error with code " + err.code);
    },
    onTransitionSuccess() {
      logger.debug("Transition success");
    }
  };
}

logtownPlugin.pluginName = "LOGTOWN_PLUGIN";

module.exports = logtownPlugin;
