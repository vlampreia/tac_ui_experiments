define(function(require) {
  var System = require('System');
      TransformComponent = require('TransformComponent');
      PlanetInfo = require('PlanetInfoComponent');
      CameraScaleComponent = require('CameraScaleComponent');
      Vector = require('Vector');


  return class PlanetTacUIRenderSystem extends System {
    constructor(ctx, camera) {
      super([TransformComponent, PlanetInfo]);
      this.ctx = ctx;
      this.active_camera = camera;
    }

    set_ctx(ctx) {
      this.ctx = ctx;
    }

    set_camera(camera) {
      this.active_camera = camera;
    }

    setup() {
      this.ctx.save();

      var cpos = this.active_camera.get_component(TransformComponent).get_position();
      this.scale = this.active_camera.get_component(CameraScaleComponent).scale;

      this.ctx.translate(
        -(cpos.x * this.scale - this.ctx.canvas.width/2),
        -(cpos.y * this.scale - this.ctx.canvas.height/2)
      );

      this.ctx.strokeStyle = 'rgb(255, 255, 255)';
      this.ctx.strokeStyle = 'rgb(255, 0, 0)';
      this.ctx.setLineDash([10, 5]);
      return true;
    }

    teardown() {
      this.ctx.restore();
    }

    process_entity(entity) {
      var pos = entity.get_component(TransformComponent).get_position().mul_f(this.scale);
      var planet = entity.get_component(PlanetInfo);

      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, planet.radius * this.scale, 0, 2 * Math.PI);
      this.ctx.moveTo(pos.x - 50, pos.y);
      this.ctx.lineTo(pos.x + 50, pos.y);
      this.ctx.moveTo(pos.x, pos.y - 50);
      this.ctx.lineTo(pos.x, pos.y+50);
      this.ctx.stroke();
//    let centre = planet.centre.mul_f(this.scale);
//      this.ctx.beginPath();
//      this.ctx.ellipse(
//        centre.x, centre.y,
//        planet.apastron * this.scale, planet.periastron * this.scale,
//        0, 0, 2*Math.PI
//      );
//      this.ctx.stroke();
    }
  }

});
