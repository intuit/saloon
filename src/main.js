import logger from './logger';
import seeder from './seeder';
export const setLoggingLevel = logger.setLoggingLevel.bind(logger);
export const logToFile = logger.logToFile.bind(logger);

export const seed = seeder.seed.bind(seeder);
export const setDefinitions = seeder.setDefinitions.bind(seeder);
