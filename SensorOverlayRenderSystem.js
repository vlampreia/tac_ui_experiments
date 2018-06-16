define(function(require) {
  var System = require('System');

  var Transform = require('TransformComponent');
      Sensor = require('SensorComponent');
      Scale = require('CameraScaleComponent');


  return class SensorOverlayRenderSystem extends System {
    constructor(ctx, camera) {
      super([Transform, Sensor]);

      this.ctx = ctx;
      this.camera = camera;
      this._is_visible = true;
    }

    toggle_visible() {
      this._is_visible = !this._is_visible;
    }

    set_visible(visible) {
      this._is_visible = visible;
    }

    set_ctx(ctx) {
      this.ctx = ctx;
    }

    set_camera(camera) {
      this.camera = camera;
    }

    setup() {
      if (this._is_visible) return false;
      this.ctx.save();

      var campos = this.camera.get_component(Transform).get_position();
      this.scale = this.camera.get_component(Scale).scale;

      this.ctx.translate(
        -(campos.x * this.scale - this.ctx.canvas.width/2),
        -(campos.y * this.scale - this.ctx.canvas.height/2)
      );

      this.ctx.strokeStyle = 'rgb(100, 100, 255)';
      this.ctx.fillStyle = 'rgba(100, 100, 255, 0.1)';
      return true;
    }

    teardown() {
      this.ctx.restore();
    }

    process_entity(entity) {
      var transf = entity.get_component(Transform);
      var pos = transf.get_position().mul_f(this.scale);
      var s = entity.get_component(Sensor);

      this.ctx.beginPath();
      if (s.spread < Math.PI) this.ctx.moveTo(pos.x, pos.y);
      this.ctx.arc(
          pos.x, pos.y,
          s.range * this.scale,
          transf.get_orientation() + -s.spread, transf.get_orientation() + s.spread
      );
      if (s.spread < Math.PI) this.ctx.lineTo(pos.x, pos.y);
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

});
