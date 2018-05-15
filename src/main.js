import logger from './logger';
import seeder from './seeder';

const setLoggingLevel = logger.setLoggingLevel.bind(logger);
const logToFile = logger.logToFile.bind(logger);
const seed = seeder.seed.bind(seeder);
const setDefinitions = seeder.setDefinitions.bind(seeder);

export {
  setLoggingLevel,
  logToFile,
  seed,
  setDefinitions,
};

