define(function() {

  class EventType {
    constructor(name) {
      this.name = name;
    }

    toString() {
      return this.name;
    }
  }

  EventType.RESIZE = new EventType('resize');
  EventType.DOUBLE_CLICK = new EventType('dblclick');
  EventType.MOUSE_DOWN = new EventType('mousedown');
  EventType.MOUSE_UP = new EventType('mouseup');
  EventType.MOUSE_MOVE = new EventType('mousemove');
  EventType.CONTEXT_MENU = new EventType('contextmenu');
  EventType.KEY_DOWN = new EventType('keydown');
  EventType.KEY_UP = new EventType('keyup');
  EventType.SCROLL = new EventType('wheel');

  return EventType;

});
