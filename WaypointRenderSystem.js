define(function(require) {
  var System = require('System');

  var WaypointComponent = require('WaypointComponent');
      TransformComponent = require('TransformComponent');
      CameraScaleComponent = require('CameraScaleComponent');


  return class WaypointRenderSystem extends System {
    constructor(ctx, camera) {
      super([WaypointComponent, TransformComponent]);
      this.ctx = ctx;
      this.camera = camera;
    }

    set_ctx(ctx) {
      this.ctx = ctx;
    }

    set_camera(camera) {
      this.camera = camera;
    }

    setup() {
      this.ctx.save();
      this.ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
      this.ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';

      var cpos = this.camera.get_component(TransformComponent).get_position();
      this.scale = this.camera.get_component(CameraScaleComponent).scale;

      this.ctx.translate(
        -(cpos.x * this.scale - this.ctx.canvas.width/2),
        -(cpos.y * this.scale - this.ctx.canvas.height/2)
      );
      return true;
    }

    teardown() {
      this.ctx.restore();
    }

    process_entity(entity) {
      var wp = entity.get_component(WaypointComponent);
      if (!wp.is_active()) return;

      var p = entity.get_component(TransformComponent).get_position().mul_f(this.scale);
      var t = wp.get_position().mul_f(this.scale);

      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(t.x, t.y);
      this.ctx.stroke();
      this.ctx.fillRect(t.x - 1, t.y - 1, 3, 3)
    }
  }

});
