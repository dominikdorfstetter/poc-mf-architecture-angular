import { Observable as WindowedObservable } from 'windowed-observable/dist/observable';

export interface MessageBus {
  publishData<T>(token: string, data: T): void;
  getDataStream<T>(token: string): WindowedObservable<T>;
  destroyDataStream(token: string): void;
}
