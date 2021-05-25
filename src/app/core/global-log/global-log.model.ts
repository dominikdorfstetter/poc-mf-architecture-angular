import { Observable as WindowedObservable } from 'windowed-observable/dist/observable';

export const MB_ERROR = 'mb-error';
export const MB_DEBUG = 'mb-debug';
export const MB_INFO = 'mb-info';
export const MB_WARN = 'mb-warn';

export type MB_Severity = 'info' | 'warn' | 'debug' | 'error';

export interface Message {
  title: string;
  severity: MB_Severity;
  message: string;
}

export interface GlobalLog {
  errors$: WindowedObservable<Message>;
  warnings$: WindowedObservable<Message>;
  infos$: WindowedObservable<Message>;
  debug$: WindowedObservable<Message>;
  emitError(message: string, title?: string): void;
  emitWarning(message: string, title?: string): void;
  emitInfo(message: string, title?: string): void;
  emitDebug(message: string, title?: string): void;
}
