define(function(require) {
  var Vector = require('Vector');

  return class Planet {
    constructor(pos, diameter) {
      this.pos = pos;
      this.diameter = diameter;
    }


    update(t, dt) {

    }


    draw(ctx, scale) {
      var pos = this.pos.mul_f(scale);
      ctx.save();
      ctx.strokeStyle = 'rgb(255, 255, 0)';
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.diameter*scale, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    }
  }

});
