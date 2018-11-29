
/**
 * A logger utility.
 * @class
 */
class Logger {
  /**
     * A way to set a custom logging level.
     * @access public
     */
  setLoggingLevel() {
    this.warn('Setting logging level is currently disabled.');
  }

  /**
     * Enable logging to file.
     * @access public
     */
  logToFile() {
    this.warn('Logging to file is currently disabled.');
  }

  /**
     * Debug logging.
     * @param {string} msg
     * @access public
     */
  debug(msg) {
    this._log('debug', msg);
  }

  /**
     * Info logging.
     * @param {string} msg
     * @access public
     */
  info(msg) {
    this._log('info', msg);
  }

  /**
     * Warn logging.
     * @param {string} msg
     * @access public
     */
  warn(msg) {
    this._log('warn', msg);
  }

  /**
     * Error logging.
     * @param {string} msg
     * @access public
     */
  error(msg) {
    this._log('error', msg);
  }

  /**
     * Helper method for calling the winston logging instance.
     * @param {string} level
     * @param {string} msg
     * @access private
     */
  _log(level, msg) {
    if (!console[level]) { // eslint-disable-line no-console
      return;
    }

    let output = msg;

    if (typeof output === 'object') {
      output = JSON.stringify(output);
    }

    output = `${new Date().toUTCString()} ${level}: ${output}`;
    console[level].call(this, output); // eslint-disable-line no-console
  }
}

const logger = new Logger();
export default logger;
