// The loglevel enum


export interface Logger {
  logInfo(component: string, message: string, args?: any[]): void;
  logWarn(component: string, message: string, args?: any[]): void;
  logError(component: string, message: string, args?: any[]): void;
}
