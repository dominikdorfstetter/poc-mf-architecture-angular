function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var EVENTS = '__events__';
var SHARED = '__shared__';
var OBSERVERS = '__observers__';
var Observable = /*#__PURE__*/function () {
  function Observable(namespace) {
    this.dispatch = this.publish;
    Observable.initialize();
    this.namespace = namespace;
  }

  Observable.initialize = function initialize() {
    if (!window[SHARED]) {
      var _window$SHARED;

      window[SHARED] = (_window$SHARED = {}, _window$SHARED[EVENTS] = {}, _window$SHARED[OBSERVERS] = {}, _window$SHARED);
    }

    if (!window[SHARED][EVENTS]) {
      window[SHARED][EVENTS] = {};
    }

    if (!window[SHARED][OBSERVERS]) {
      window[SHARED][OBSERVERS] = {};
    }
  };

  var _proto = Observable.prototype;

  _proto.publish = function publish(data) {
    var _this$observers;

    (_this$observers = this.observers) === null || _this$observers === void 0 ? void 0 : _this$observers.forEach(function (observer) {
      return observer(data);
    });
    this.events.push(data);
  };

  _proto.subscribe = function subscribe(observer, options) {
    if (options === void 0) {
      options = {
        latest: false,
        every: false
      };
    }

    var _options = options,
        every = _options.every,
        latest = _options.latest;
    var events = this.events;
    var hasOptions = latest || every;

    if (hasOptions && events.length > 0) {
      if (latest) {
        var lastEvent = events[events.length - 1];
        observer(lastEvent);
      }

      if (every) {
        observer(events);
      }
    }

    this.observers = this.observers.concat(observer);
  };

  _proto.unsubscribe = function unsubscribe(observer) {
    this.observers = this.observers.filter(function (obs) {
      return obs !== observer;
    });
  };

  _proto.clear = function clear() {
    var _this$observers2;

    (_this$observers2 = this.observers) === null || _this$observers2 === void 0 ? void 0 : _this$observers2.forEach(function (observer) {
      return observer(undefined);
    });
    this.events = [];
    this.observers = [];
  };

  _createClass(Observable, [{
    key: "events",
    get: function get() {
      return window[SHARED][EVENTS][this._namespace];
    },
    set: function set(events) {
      window[SHARED][EVENTS][this._namespace] = events;
    }
  }, {
    key: "observers",
    get: function get() {
      return window[SHARED][OBSERVERS][this._namespace];
    },
    set: function set(observers) {
      window[SHARED][OBSERVERS][this._namespace] = observers;
    }
  }, {
    key: "namespace",
    set: function set(namespace) {
      this._namespace = namespace;
      if (!this.events) this.events = [];
      if (!this.observers) this.observers = [];
    }
  }]);

  return Observable;
}();

export { EVENTS, OBSERVERS, Observable, SHARED };
//# sourceMappingURL=windowed-observable.esm.js.map
