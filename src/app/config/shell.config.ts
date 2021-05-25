import { ShellConfig } from '@app/shared/services/shell/shell.models';
import { Map } from 'immutable';

export const SHELL_CONFIG: ShellConfig = {
  initialRoute: '/home',
  outletId: 'content',
  preload: false,
  clients: Map({
    "client-a": {
      loaded: false,
      src: 'assets/micro-frontends/client-a/main.js',
      element: 'client-a',
      route: '/client-a'
    },
    "client-b": {
      loaded: false,
      src: 'assets/micro-frontends/client-b/main.js',
      element: 'client-b',
      route: '/client-b'
    },
    "client-c": {
      loaded: false,
      src: 'assets/micro-frontends/client-c/main.js',
      element: 'client-c',
      route: '/client-c'
    },
    "client-d": {
      loaded: false,
      src: [
        'assets/micro-frontends/client-d/chunk-vendors.js',
        'assets/micro-frontends/client-d/app.js',
      ],
      element: 'client-d',
      route: '/client-d'
    }
  })
};
