import { MessageBusFactory } from '../message-bus/message-bus.factory';
import { Observable as WindowedObservable } from 'windowed-observable';
import { GlobalLog, MB_DEBUG, MB_ERROR, MB_INFO, MB_WARN, Message } from './global-log.model';

let messageBus = MessageBusFactory.getInstance();

export class GlobalLogService implements GlobalLog {
  public errors$: WindowedObservable<Message> = messageBus.getDataStream(MB_ERROR);
  public warnings$: WindowedObservable<Message> = messageBus.getDataStream(MB_WARN);
  public infos$: WindowedObservable<Message> = messageBus.getDataStream(MB_INFO);
  public debug$: WindowedObservable<Message> = messageBus.getDataStream(MB_DEBUG);

  /**
   * Emit a global error
   *
   * @param {string} message
   * @param {string} title
   */
  public emitError(message: string, title?: string): void {
    const error = {
     title: title ? title : 'Error',
      message
    } as Message;
    this.errors$.publish(error);
  }

  /**
   * Emit a global warning
   *
   * @param {string} message
   * @param {string} title
   */
  public emitWarning(message: string, title?: string): void {
    const warning = {
      title: title ? title : 'Warning',
      message
    } as Message;
    this.warnings$.publish(warning);
  }

  /**
   * Emit a global information
   *
   * @param {string} message
   * @param {string} title
   */
  public emitInfo(message: string, title?: string): void {
    const info = {
      title: title ? title : 'Info',
      message
    } as Message;
    this.infos$.publish(info);
  }

  /**
   * Emit a global debug
   *
   * @param {string} message
   * @param {string} title
   */
  public emitDebug(message: string, title?: string): void {
    const debug = {
      title: title ? title : 'Debug',
      message
    } as Message;
    this.debug$.publish(debug);
  }
}
