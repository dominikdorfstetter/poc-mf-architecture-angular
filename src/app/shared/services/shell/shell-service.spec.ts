import { ClientConfig, ShellConfig } from '@shared/services/shell/shell.models';
import { ShellService, TemporaryShellService } from '@shared/services/shell/shell.service';
import { should } from 'chai';
import { List, Map } from 'immutable';
import { JSDOM } from 'jsdom';

/**
 * @jest-environment jsdom
 */
should();

const MOCK_HTML =
 `<!doctype html>
  <html lang="en">
      <head></head>
    <body>
      <div class="wrapper">
        <div class="main-panel">
            <div id="content" class="content">
              <!-- Micro Frontends go here -->
            </div>
        </div>
      </div>
    </body>
  </html>`;
const MOCK_SHELL_CONFIG_NO_PRELOAD: ShellConfig = {
  initialRoute: '',
  clients: Map({
      "client-a": {
        loaded: false,
        src: '',
        element: 'client-a',
        route: '/client-a'
      },
      "client-b": {
        loaded: false,
        src: '',
        element: 'client-b',
        route: '/client-b'
      }
    }
  ),
  preload: false,
  outletId: 'content'
};
const MOCK_SHELL_CONFIG_PRELOAD: ShellConfig = {
  initialRoute: '/client-a',
  clients: Map({
      "client-a": {
        loaded: false,
        src: 'assets/client-a/main.js',
        element: 'client-a',
        route: '/client-a'
      },
      "client-b": {
        loaded: false,
        src: [
          'assets/client-b/main.js',
          'assets/client-b/vendors.js'
        ],
        element: 'client-b',
        route: '/client-b'
      }
    }
  ),
  preload: true,
  outletId: 'content'
};
const MOCK_HASH = '#/home';

describe('ShellService', () => {
  let shellService: TemporaryShellService;

  const { location } = window;
  let addEventlistenerSpy: any;
  let createElementSpy: any;

  beforeAll(() => {
    const { document, location } = new JSDOM(MOCK_HTML).window;
    Object.defineProperty(window, 'document', {
      writable: true,
      value: document
    });
    Object.defineProperty(window, 'location', {
      writable: true,
      value: location
    });
    ( window as any ).addEventListener = jest.fn();
  });

  it('should set location.hash if it is undefined/null and initialRoute is set in config', () => {
    ( window as any ).location = {
      hash: undefined
    };
    shellService = new ShellService(MOCK_SHELL_CONFIG_PRELOAD);
    ( window as any ).location.hash.should.exist
                     .and.be.equal(MOCK_SHELL_CONFIG_PRELOAD.initialRoute);
  });

  describe('SHELL_CONFIG with preload true', () => {
    beforeEach(() => {
      createElementSpy = jest.spyOn(window.document, 'createElement');
      addEventlistenerSpy = jest.spyOn(window, 'addEventListener');
      shellService = new ShellService(MOCK_SHELL_CONFIG_PRELOAD);
    });

    it('should set MOCK_SHELL_CONFIG_PRELOAD as CONFIG', () => {
      ( shellService as any ).config.should.exist
                             .and.be.deep.equal(MOCK_SHELL_CONFIG_PRELOAD);
    });

    it('should attach event listener on hashchange', () => {
      expect(addEventlistenerSpy)
        .toHaveBeenNthCalledWith(1, 'hashchange', expect.anything());
    });

    it('should create all configured script-elements', () => {
      MOCK_SHELL_CONFIG_PRELOAD.clients.forEach((config: ClientConfig, key: string) => {
        const scripts: HTMLElement = document.getElementById(`scripts-${config.element}`);
        scripts.should.exist.and.is.an('Object');
        const isString = (obj: any) => typeof obj === 'string';
        const files = isString(config.src)
          ? List([config.src])
          : List([...config.src]);
        files.forEach((file: string) => {
          scripts.innerHTML.should.contain(`${file}`);
        });
      });
    });

    it('should create exactly one of configured elements', () => {
      MOCK_SHELL_CONFIG_PRELOAD.clients.forEach((config: ClientConfig, key: string) => {
        const elements: HTMLCollectionOf<Element> = document.getElementsByTagName(`${config.element}`);
        expect(elements.length).toBe(1);
      });
    });
  });

  describe('SHELL_CONFIG with preload false', () => {
    beforeEach(() => {
      addEventlistenerSpy = jest.spyOn(window, 'addEventListener');
      createElementSpy = jest.spyOn(window.document, 'createElement');
      shellService = new ShellService(MOCK_SHELL_CONFIG_NO_PRELOAD);
    });

    it('should set MOCK_SHELL_CONFIG_PRELOAD as CONFIG', () => {
      ( shellService as any ).config.should.exist
                             .and.be.deep.equal(MOCK_SHELL_CONFIG_NO_PRELOAD);
    });

    it('should create no DOM elements for clients on preload false', () => {
      expect(createElementSpy).not.toHaveBeenCalled();
    });

  });

  it('should set window.location to  on navigate', () => {
    shellService = new ShellService(MOCK_SHELL_CONFIG_PRELOAD);
    shellService.navigate('/client-a');
    window.location.hash.should.be.equal('/client-a');
  });

  it('should set client-a to hidden false on navigate', () => {
    shellService = new ShellService(MOCK_SHELL_CONFIG_PRELOAD);
    shellService.navigate('/client-a');
    const elClientA = document.getElementsByTagName('client-a').item(0) as HTMLElement;
    elClientA.should.exist
             .and.property('hidden').to.be.false;
  });

  it('should set client-a to hidden false on location.hash change', () => {
    shellService = new ShellService(MOCK_SHELL_CONFIG_PRELOAD);
    window.location.hash = '#/client-b';
    (shellService as any).urlChanged();
    const elClientA = document.getElementsByTagName('client-b').item(0) as HTMLElement;
    elClientA.should.exist
             .and.property('hidden').to.be.false;
  });

  it('should throw error if element to show/hide is not loaded', () => {
    shellService = new ShellService(MOCK_SHELL_CONFIG_NO_PRELOAD);
    // we reset the dom
    expect(() => (shellService as any).showClient('client-a')).toThrow('Client client-a has not been loaded yet.');
    expect(() => (shellService as any).hideClient('client-a')).toThrow('Client client-a has not been loaded yet.');
  });

  it('should throw error if element is loaded multiple times into dom', () => {
    shellService = new ShellService(MOCK_SHELL_CONFIG_PRELOAD);
    const elClientA = document.createElement('client-a') as HTMLElement;
    elClientA.innerHTML = '<!-- please dont remove me -->';
    (document as any).body.appendChild(elClientA);
    // we reset the dom
    expect(() => (shellService as any).showClient('client-a')).toThrow('Client client-a is loaded several times.');
    expect(() => (shellService as any).hideClient('client-a')).toThrow('Client client-a is loaded several times.');
  });

  afterAll(() => {
    window.location = location;
  });
});
