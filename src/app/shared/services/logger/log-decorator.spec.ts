import { logMethod } from './log.decorator';

interface IMock {
  fn1: () => void;
  fn2: (a: number) => number;
}

/**
 * Mock-Class with our decorators
 *
 */
class Mock implements IMock {
  constructor() {}

  @logMethod()
  fn1(): void {}

  @logMethod()
  public fn2(a: number): number {
    return a;
  }
}

describe('Logging Decorators', () => {
  let mockClass: IMock;

  beforeEach(() => {
    mockClass = new Mock();
    // we mock away global console object
    (console as any) = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
  });

  it('should console.info on fn1() text should contain classname and "fn1 with no arguments"', () => {
    const consoleInfoSpy = jest.spyOn(console, 'info');
    const testRegex = /Mock.*(fn1 with no arguments)/;
    mockClass.fn1();
    expect(consoleInfoSpy).toHaveBeenCalledWith((expect as any).stringMatching(testRegex));
  });

  it('should console.info on fn2() text should contain classname and "fn2 with [1]"', () => {
    const consoleInfoSpy = jest.spyOn(console, 'info');
    const testRegex = /Mock.*(fn2 with \[1])/;
    mockClass.fn2(1);
    expect(consoleInfoSpy).toHaveBeenCalledWith((expect as any).stringMatching(testRegex));
  });
});
