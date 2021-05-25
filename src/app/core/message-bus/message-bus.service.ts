import { Observable as WindowedObservable } from 'windowed-observable';
import { Map } from 'immutable';
import { MessageBus } from './message-bus.models';

export class MessageBusService implements MessageBus {
  private _messageMap: Map<string, WindowedObservable<any>> = Map();

  /**
   * Send data into a channel
   *
   * @param {string} token
   * @param {T} data
   */
  public publishData<T>(token: string, data: T): void {
    let dataStream = this._messageMap.get(token) as WindowedObservable<T>;
    if (dataStream) {
      dataStream.publish(data);
    } else {
      dataStream = new WindowedObservable<T>(token);
      this._messageMap = this._messageMap.set(token, dataStream)
      dataStream.publish(data);
    }
  }

  /**
   * Get data from a channel
   *
   * @param {string} token
   * @returns {WindowedObservable<T>}
   */
  public getDataStream<T>(token: string): WindowedObservable<T> {
    let dataStream = this._messageMap.get(token) as WindowedObservable<T>;
    if (!dataStream) {
      dataStream = new WindowedObservable<T>(token);
      this._messageMap = this._messageMap.set(token, dataStream);
    }
    return dataStream;
  }

  /**
   * Deletes a channel from the stream
   *
   * @param {string} token
   */
  public destroyDataStream(token: string): void {
    this._messageMap = this._messageMap.delete(token);
  }

}
