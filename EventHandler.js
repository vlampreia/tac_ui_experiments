define(['EventType'], function(EventType) {

  return class EventManager {

    constructor() {
      this.event_listeners = {};

      this._bind_window_event(EventType.RESIZE);
      this._bind_window_event(EventType.MOUSE_DOWN);
      this._bind_window_event(EventType.MOUSE_MOVE);
      this._bind_window_event(EventType.CONTEXT_MENU);
      this._bind_window_event(EventType.KEY_DOWN);
      this._bind_window_event(EventType.KEY_UP);
      this._bind_window_event(EventType.SCROLL);

      this.keycode_char = {
        65: 'a',
        83: 's',
        87: 'w',
        68: 'd'
      }
    }


    _bind_window_event(event_type) {
      window.addEventListener(
        event_type.toString(),
        this.event_dispatcher(event_type).bind(this)
      );
    }


    add_listener(event_type, delegate) {
      if (!(event_type in this.event_listeners)) {
        this.event_listeners[event_type] = [];
      }

      this.event_listeners[event_type].push(delegate);
    }


    event_dispatcher(event_type) {
      return function(e) {
        if (!(event_type in this.event_listeners)) return;

        for (var i=0; i<this.event_listeners[event_type].length; ++i) {
          this.event_listeners[event_type][i](e);
        }
      }
    }

  }

});
