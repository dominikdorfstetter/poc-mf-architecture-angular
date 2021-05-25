import { environment } from '@environment';

export type LOGLEVEL = 'INFO' | 'WARN' | 'ERROR';

/**
 * Injection Token
 */
export abstract class TemporaryLoggerService {
  abstract logInfo(component: string, message: string, ...args: any[]): void;
  abstract logWarn(component: string, message: string, ...args: any[]): void;
  abstract logError(component: string, message: string, ...args: any[]): void;
}

/**
 * Console log service that isn't polluting production
 *
 * @author Dominik Dorfstetter (dominik.dorfstetter@wienit.at)
 */
export class LoggerService implements TemporaryLoggerService {
  private isDebug = environment.debug;

  /**
   * getLogMessage builds our Log-Message
   *
   * @param component Component that is calling the log fn
   * @param level Log-Level
   * @param message the Message to log out
   * @private
   */
  private static getLogMessage(component: string, level: string, message: string): string {
    const formattedDate = new Date().toTimeString().substr(0, 8);

    return `[${component};${formattedDate};${level}]\t${message}`;
  }

  /**
   * Log info message
   *
   * @param component string the component/service/pipe
   * @param message string The log-message
   * @param args list of objects
   * @public
   */
  public logInfo(component: string, message: string, ...args: any[]): void {
    // eslint-disable-next-line no-console
    this.log(console.info, component, message, 'INFO', ...args);
  }

  /**
   * Log warn message
   *
   * @param component string the component/service/pipe
   * @param message string The log-message
   * @param args optional Any object you want to log
   * @public
   */
  public logWarn(component: string, message: string, ...args: any[]): void {
    this.log(console.warn, component, message, 'WARN', ...args);
  }

  /**
   * Log error message
   *
   * @param component string the component,
   * @param message string The log-message
   * @param args optional Any object you want to log
   * @public
   */
  public logError(component: string, message: string, ...args: any[]): void {
    this.log(console.error, component, message, 'ERROR', ...args);
  }

  /**
   * The log function
   *
   * @param logFn (...args: any) => void the function we use to log
   * @param component
   * @param message string The log-message
   * @param level LOGLEVEL The log level
   * @param params optional Any object you want to log
   * @private
   */
  private log(
    logFn: (...args: any) => void,
    component: string,
    message: string,
    level: LOGLEVEL,
    ...params: any[]
  ): void {
    if (this.isDebug && message && logFn && component) {
      logFn(LoggerService.getLogMessage(component, level, message), ...params);
    }
  }
}
