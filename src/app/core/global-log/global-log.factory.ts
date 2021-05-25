import { GlobalLog } from './global-log.model';
import { GlobalLogService } from './global-log.service';

let globalMessageService: GlobalLog;

/**
 * Message bus factory class
 */
export class GlobalLogFactory {
  public static getInstance = (): GlobalLog => {
    if (!globalMessageService) {
      globalMessageService = new GlobalLogService();
    }
    return globalMessageService;
  };
}
