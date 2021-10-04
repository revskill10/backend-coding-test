import { ConfigService } from '../config';
import { WinstonModule } from 'nest-winston';

interface CreateLoggerType {
  config: ConfigService;
}
export const createLogger = ({ config }: CreateLoggerType) => {
  return WinstonModule.createLogger(config.getWinstonOptions());
};
