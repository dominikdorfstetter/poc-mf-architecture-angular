import { LoggerService, TemporaryLoggerService } from '@shared/services/logger/logger.service';

let logger: TemporaryLoggerService;

export class LoggerFactory {
  public static getInstance = (): TemporaryLoggerService => {
    if (!logger) {
      logger = new LoggerService();
    }
    return logger;
  };
}
