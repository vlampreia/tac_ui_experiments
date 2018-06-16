define(function(require) {
  var Component = require('Component');

  return class WaypointComponent extends Component {
    constructor() {
      super();
      this._position = new Vector(0,0);
      this._start = new Vector(0,0);
      this._is_active = false;
    }

    get_start_pos() {
      return this._start;
    }

    set_start_pos(pos) {
      this._start = pos;
    }

    get_position() {
      return this._position;
    }

    set_position(position) {
      this._position = position;
    }

    set_active(active) {
      this._is_active = active;
    }

    is_active() {
      return this._is_active;
    }
  }

});
