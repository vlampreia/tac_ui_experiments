define(function(require) {
  var Component = require('Component');

  return class TransformComponent extends Component {
    constructor(position) {
      super();
      this._position = position || new Vector(0,0);
      this._prev_position = position;
      this._orientation = 0;
      this._orientation_v = null;
      this.set_orientation(0);
      this._parent = null;
    }

    set_parent(transform) {
      this._parent = transform;
    }

    get_orientation() {
      if (this._parent !== null) {
        return this._parent.get_orientation() + this._orientation;
      }

      return this._orientation;
    }

    get_orientation_v() {
      if (this._parent !== null) {
        return this._orientation_v.rotate(this._parent.get_orientation());
      }
      return this._orientation_v;
    }

    set_orientation_deg(angle) {
      this.set_orientation(angle * (Math.PI/180));
    }

    set_orientation(angle) {
      this._orientation = angle;
      this._orientation_v = new Vector(
        Math.cos(this._orientation),
        Math.sin(this._orientation)
      );
    }

    set_orientation_v(vector) {
      if (this._parent !== null) {
        vector = vector.rotate(-this._parent.get_orientation());
        //vector = vector.sub_v(this._parent.get_orientation_v());
      }
      this._orientation_v = vector;
      this._orientation = Math.atan2(vector.y, vector.x);
    }

    get_position() {
      if (this._parent !== null) {

        return this._position.rotate(this._parent.get_orientation()).add_v(this._parent.get_position());
        //return this._parent.get_position().add_v(this._position);
      }
      return this._position;
    }

    set_position(position) {
      this._prev_position = this._position;
      this._position = position.copy();
    }

    get_previous_pos() {
      return this._prev_position;
    }
  }

});
