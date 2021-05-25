import { Map } from 'immutable';

export interface ClientConfig {
    loaded: boolean;
    src: string | string[];
    element: string;
    route: string;
}

export interface ShellConfig {
    outletId?: string;
    initialRoute: string;
    preload: boolean;
    clients: Map<string, ClientConfig>;
}
