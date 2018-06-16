define(function(require) {
  var System = require('System');
      TransformComponent = require('TransformComponent');
      ShipInfoComponent = require('ShipInfoComponent');
      ShipTypeIconComponent = require('ShipTypeIconComponent');
      Vector = require('Vector');


  return class SpatialUiRenderSystem extends System {
    constructor() {
      super([TransformComponent, ShipInfoComponent, ShipTypeIconComponent]);
      this.ctx = null;
      this.active_camera = null;
      this.cursor_pos = null;

      this.last_t = 0;
      this.flash_t = 250;
      this.on = true;

      this.player_e = null;
      this.pinfo = null;
    }

    set_ctx(ctx) {
      this.ctx = ctx;
    }

    set_camera(camera) {
      this.active_camera = camera;
    }

    set_player_entity(player) {
      this.player_e = player;
      this.pinfo = this.player_e.get_component(ShipInfoComponent);
    }

    set_camera_entity(camera) {
      this.active_camera = camera;
    }


    setup() {
      if (this._ecs._time > this.last_t + this.flash_t) {
        this.last_t = this._ecs._time;
        this.on = !this.on;
      }

      this.ctx.save();
      this.ctx.strokeStyle = 'rgb(0, 255, 0)';
      this.ctx.font = '10px mono';

      var cpos = this.active_camera.get_component(TransformComponent).get_position();
      this.scale = this.active_camera.get_component(CameraScaleComponent).scale;

      var centre_x = this.ctx.canvas.width/2;
      var centre_y = this.ctx.canvas.height/2;
      this.ctx.translate(
        -(cpos.x*this.scale - centre_x), -(cpos.y*this.scale - centre_y)
      );

      return true;
    }

    teardown() {
      this.ctx.restore();
    }

    process_entity(entity) {
      var pos = entity.get_component(TransformComponent)
                      .get_position().mul_f(this.scale);
      var info = entity.get_component(ShipInfoComponent);
      var path = entity.get_component(ShipTypeIconComponent);

      var col = '';
      let draw_icon = true;
      if (info.alliance === this.pinfo.alliance) {
        col = 'rgb(100, 255, 0)';
      } else if (info.alliance === Alliance.UNKNOWN) {
        col = 'rgb(255, 255, 0)';
      } else if (info.alliance === Alliance.NEUTRAL) {
        col = 'rgb(255, 255, 255)';
      } else {
        col = 'rgb(220, 50, 20)';
        draw_icon = this.on;
      }

      this.ctx.strokeStyle = col;
      this.ctx.fillStyle = col;

      if (draw_icon) path.draw(this.ctx, pos);
    }
  }

});
