define(function(require) {
  var Vector = require('Vector');

  return class Camera {
    constructor(engine) {
      this._engine = engine;

      this._pos = new Vector(0,0);
      this._scale = 1.0;
      this._viewport_dims = new Vector(
        this._engine.ctx.canvas.width,
        this._engine.ctx.canvas.height
      );
      this._viewport_centre = this._viewport_dims.div_f(2);
    }

    set_pos(pos) {
      this._pos = pos.mul_f(this._scale);
    }

    get_pos() {
      return this._pos;
    }

    set_scale(scale) {
      if (this._scale == scale) return;
      this._scale = scale;
      this.set_pos(this._pos)
    }

    get_scale() {
      return this._scale;
    }

    set_viewport(width, height) {
      this._viewport_dims.x = width;
      this._viewport_dims.y = height;
      this._viewport_centre = this._viewport_dims.div_f(2);
    }

    get_viewport() {
      return this._viewport_dims;
    }

    get_viewport_centre() {
      return this._viewport_centre;
    }
  }
});
