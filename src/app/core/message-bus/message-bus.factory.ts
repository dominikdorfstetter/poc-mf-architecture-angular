import { MessageBus } from './message-bus.models';
import { MessageBusService } from './message-bus.service';

let messageBusService: MessageBus;

/**
 * Message bus factory class
 */
export class MessageBusFactory {
  public static getInstance = (): MessageBus => {
    if (!messageBusService) {
      messageBusService = new MessageBusService();
    }
    return messageBusService;
  };
}
