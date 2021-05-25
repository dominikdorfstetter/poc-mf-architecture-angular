import { ClientConfig, ShellConfig } from './shell.models';
import { List } from 'immutable';

// Our singleton service
let service: TemporaryShellService;

/**
 * Injection Token & public interace definition
 */
export abstract class TemporaryShellService {
  public abstract navigate(url: string): void;
}

/**
 * Shell Service - handles load/unload/hide/show of micro-frontends
 */
export class ShellService implements TemporaryShellService {
  private config: ShellConfig;

  constructor(config: ShellConfig) {
    this.config = config;

    if (!location.hash && config.initialRoute) {
      location.hash = config.initialRoute;
    }

    // add Event-Listener to location change
    window.addEventListener('hashchange', () => this.urlChanged());

    // work around the fact, that first url change gets not detected
    setTimeout(() => this.urlChanged(), 0);

    // If preload is on, do so.
    config.preload && this.preloadAllClients();
  }

  /**
   * Navigation helper, sets the location
   *
   * @param {string} url element to navigate to
   */
  public navigate(url: string): void {
    const pos = location.hash.indexOf('?');
    const query = pos !== -1 ? location.hash.substr(pos): '';
    location.hash = url + query;
  }

  /**
   * Checks if Current location matches the configured route
   *
   * @param {ClientConfig} config
   * @returns {RegExpMatchArray}
   */
  private static matchesRoute({ route }: ClientConfig): boolean {
    const regex = new RegExp(`.*${route}.*`)
    return location.hash.match(regex) !== null;
  }

  /**
   * Checks if config item is loaded
   *
   * @param {ClientConfig} item
   * @returns {boolean}
   */
  private static isLoaded = (item: ClientConfig): boolean => !!item && item.loaded;


  /**
   * onRoute change function
   *
   * @private
   */
  private urlChanged(): void {
    this.config.clients.forEach((config: ClientConfig, key: string) => {
      const configItem = this.config.clients.get(key);

      ShellService.matchesRoute(configItem)
        ? !ShellService.isLoaded(configItem)
            ? this.loadClient(key) : this.showClient(key)
        : ShellService.isLoaded(configItem) && this.hideClient(key);
    });
  }

  /**
   * Show a microfrontend
   *
   * @param {string} clientName The clients name
   * @private
   */
  private showClient(clientName: string): void {
    this.setClientVisibility(clientName, true);
  }

  /**
   * Hide a microfrontend
   *
   * @param {string} clientName
   * @private
   */
  private hideClient(clientName: string): void {
    this.setClientVisibility(clientName, false);
  }

  /**
   * Helper static that throws an error message
   *
   * @param {string} errMessage Error Message
   * @private
   */
  private static throwError(errMessage: string) {
    throw new Error(errMessage);
  }

  /**
   * Sets the visibility of a micro frontend
   * @param {HTMLElement} el HTMLElement to hide
   * @param {boolean} state
   * @private
   */
  private static setElementVisibility (el: HTMLElement, state: boolean): void {
    el.hidden = !state;
  }

  /**
   * Sets the visibility of a microfrontend
   *
   * @param {string} key Configured key for the micro-frontend
   * @param {boolean} state The current visibility state of the element
   */
  private setClientVisibility(key: string, state: boolean): void {
    const errLoadedSeveralTimes = () => ShellService.throwError(`Client ${key} is loaded several times.`)
    const errClientNotLoaded = () => ShellService.throwError(`Client ${key} has not been loaded yet.`)
    const entry = this.config.clients.get(key);
    // if key was not found in our config, throw error
    !entry.loaded && errClientNotLoaded();
    const elms = document.getElementsByTagName(entry.element);
    // if there are multiple elements throw error
    elms.length > 1 && errLoadedSeveralTimes();
    // if its a single element, toggle its visibility
    elms.length === 1 && ShellService.setElementVisibility((elms[0] as HTMLElement), state);
  }

  /**
   * Loads a specific microfrontend
   *
   * @param {string} key
   */
  private loadClient(key: string): void {
    const configItem = this.config.clients.get(key);

    // If the microfrontend is already loaded, skip
    if(ShellService.isLoaded(configItem)) return;

    configItem.loaded = true;

    // Fetch content-div
    const content = document.getElementById(this.config.outletId || 'content');

    // Add tag for micro frontend, e.s g. <client-a></client-a>
    const element = document.createElement(configItem.element) as HTMLElement;

    // container for corresponding mf-scripts
    const scriptsElement = document.createElement('mf-scripts');
    scriptsElement.id = 'scripts-' + configItem.element;

    // does the current route match the microfrontend?

    // set elements visibility based on current location
    element.hidden = !ShellService.matchesRoute(configItem);

    // Helper function to check if type of element is string
    const isString = (obj: any) => typeof obj === 'string';
    const src = configItem.src;

    // If src is a string, throw element into a List, if not its an array
    const files = isString(src)
      ? List([src])
      : List([...src]);

    // For each script, create script-tag
    files.forEach((file: string) => {
      const script = document.createElement('script');
      script.src = file;
      scriptsElement.appendChild<HTMLScriptElement>(script);
    });
    content.appendChild(scriptsElement);
    content.appendChild<HTMLElement>(element);

    // Update Client-Config
    this.config.clients = this.config.clients.set(key, configItem);
  }

  /**
   * Preload all clients
   */
  private preloadAllClients(): void {
    // for each client in our config, load resources
    this.config.clients.forEach((config, key) => {
      this.loadClient(key);
    });
  }

}

/**
 * Shell Service Factory
 */
export class ShellServiceFactory {
  public static getInstance = (config: ShellConfig): TemporaryShellService => {
    if (!service) {
      service = new ShellService(config);
    }
    return service;
  };
}

/**
 * For testing purposes
 */
export class MockShellService implements TemporaryShellService {
  public navigate(url: string): void { }
}

