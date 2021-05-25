/**
 * Custom Decorator Test
 * Method can be used to log what method, where (class) and with what arguments it was called
 *
 * What are decorators?
 *
 * They are a way to OBSERVE, MODIFY and REPLACE class decorators and members
 * classes / properties / methods / accessors / parameters
 **/
import { LoggerFactory } from './logger.factory';

const logger = LoggerFactory.getInstance();

/**
 * Decorator logMethod
 *
 * Logs out whenever the method was called
 */

export const logMethod = () => (target: any, key: string, descriptor: PropertyDescriptor) => {
  // we first cache the original method implementation
  const originalMethod = descriptor.value;
  const className = target.constructor.name;

  // then we overwrite it with a new implementation,
  // ...args represent the original arguments
  descriptor.value = function (...args: any[]) {
    const argsFormatted = args.length > 0 ? JSON.stringify(args) : 'no arguments';
    logger.logInfo(className, `Calling method ${key} with ${argsFormatted}`);
    return originalMethod.apply(this, args);
  };

  return descriptor;
};
