import winston from 'winston';

/**
 * A logger utility.
 * @class
 */
export class Logger {
    constructor() {

        /**
         * The default logging configuration.
         * @type {Object}
         * @access private
         */
        this._defaultConfig = {
            levels: {
                verbose: 1,
                debug: 2, 
                info: 3,
                warn: 4,
                error: 5
            },
            colors: {
                verbose: 'grey',
                debug: 'white',
                info: 'cyan',
                warn: 'yellow',
                error: 'red'
            }
        };

        /**
         * The default console transport.
         * @type {Object}
         * @access private
         */
        this._consoleTransport = new winston.transports.Console({
            timestamp: true,
            json: false,
            colorize: true,
            handleExceptions: true,
            level: 'warn'
        });

        /**
         * The logger instance.
         * @type {Object}
         * @access private
         */
        this._logger = new winston.Logger({
            transports: [this._consoleTransport],
            levels: this._defaultConfig.levels,
            colors: this._defaultConfig.colors
        });
    }

    /**
     * A way to set a custom logging level.
     * @param {string} level The logging level to set (debug, info, error, etc).
     * @access public
     */
    setLoggingLevel(level) {
        this._logger.configure({
            level,
            transports: [this._consoleTransport]
        });
    }

    /**
     * Enable logging to file.
     * @param {string} filename 
     * @access public
     */
    logToFile(filename) {
        this._logger.configure({
            transports: [
                this._consoleTransport,
                new winston.transports.File({ filename })
            ]
        });
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
        this._logger.log(level, msg);
    }
}

const logger = new Logger();
export default logger;