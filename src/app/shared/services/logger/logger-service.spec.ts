import { LoggerService } from './logger.service';

const TEST_MESSAGE = 'Test-Message';
const TEST_COMPONENT = 'Test-Component';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    service = new LoggerService();
    (service as any).isDebug = false;
    (console as any) = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
  });

  it('should not call console.info if logInfo() is called but isDebug is false', () => {
    const consoleInfoSpy = jest.spyOn(console, 'info');
    service.logInfo(TEST_COMPONENT, TEST_MESSAGE);
    expect(consoleInfoSpy).not.toHaveBeenCalled();
  });

  it('should call console.log if logInfo() is called & isDebug is true', () => {
    const consoleInfoSpy = jest.spyOn(console, 'info');
    (service as any).isDebug = true;
    service.logInfo(TEST_COMPONENT, TEST_MESSAGE);
    expect(consoleInfoSpy).toHaveBeenCalled();
  });

  it('should call console.log if logInfo is called with an object and isDebug is true', () => {
    (service as any).isDebug = true;
    const object = {
      a: 1,
    };
    const consoleInfoSpy = jest.spyOn(console, 'info');
    service.logInfo(TEST_COMPONENT, TEST_MESSAGE, object);
    expect(consoleInfoSpy).toHaveBeenCalled();
  });

  it('should not call console.log if logWarn() is called but isDebug is false', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    service.logWarn(TEST_COMPONENT, TEST_MESSAGE);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should call console.log if logWarn() is called & isDebug is true', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    (service as any).isDebug = true;
    service.logWarn(TEST_COMPONENT, TEST_MESSAGE);
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('should not call console.log if logError() is called but isDebug is false', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    service.logError(TEST_COMPONENT, TEST_MESSAGE);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should call console.log if logError() is called & isDebug is true', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    (service as any).isDebug = true;
    service.logError(TEST_COMPONENT, TEST_MESSAGE);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
