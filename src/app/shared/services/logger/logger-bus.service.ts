import { GlobalLogFactory } from '@app/core/global-log/global-log.factory';
import { Message } from '@app/core/global-log/global-log.model';
import { LoggerFactory } from '@shared/services/logger/logger.factory';

const globalMessage = GlobalLogFactory.getInstance();
const logger = LoggerFactory.getInstance();

/**
 * Injection Token
 */
export abstract class TemporaryLoggerBus {}

class LoggerBus implements TemporaryLoggerBus {
  constructor() {
    globalMessage.errors$.subscribe(this.onError, { latest: true });
    globalMessage.warnings$.subscribe(this.onWarn, { latest: true });
    globalMessage.infos$.subscribe(this.onInfo, { latest: true });
  }

  private onError = ({ title, message }: Message) => logger.logError(title, message);
  private onWarn = ({ title, message }: Message) => logger.logWarn(title, message);
  private onInfo = ({ title, message }: Message) => logger.logInfo(title, message);
}

let loggerBus: TemporaryLoggerBus;

export class LoggerBusFactory {
  public static getInstance = (): TemporaryLoggerBus => {
    if (!logger) {
      loggerBus = new LoggerBus();
    }
    return loggerBus;
  };
}
