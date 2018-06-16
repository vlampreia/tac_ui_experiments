define(function(require) {
  var Component = require('Component');

  return class RenderableComponent extends Component {
    constructor() {
      super();
      this.x = 0;
    }

    _draw(ctx, pos, scale) {

    }

    set_draw_function(f) {
      this._draw = f;
    }

    draw(ctx, pos, scale) {
      ctx.save();
      this._draw(ctx, pos, scale);
      ctx.restore();
    }
  }

});
