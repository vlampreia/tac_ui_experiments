define(function(require) {
  var System = require('System');

  var Transform = require('TransformComponent');
      Targeting = require('TargetingComponent');
      CameraScale = require('CameraScaleComponent');
      Player = require('PlayerComponent');
      ShipInfo = require('ShipInfoComponent');


  return class TargetingUISystem extends System {
    constructor() {
      super([Player, Targeting]);

      this.ctx = null;
      this.camera = null;

      this.last_t  = 0;
      this.flash_p = 250;
      this.on = true;

      this.player = null;
      this.pinfo = null;
    }

    set_ctx(ctx) {
      this.ctx = ctx;
    }

    set_camera(camera) {
      this.camera = camera;
    }

    set_player_entity(player) {
      this.player = player;
      this.pinfo = this.player.get_component(ShipInfo);
    }


    setup() {
      if (this._ecs._time > this.last_t + this.flash_p) {
        this.last_t = this._ecs._time;
        this.on = !this.on;
      }

      this.ctx.save();

      this.ctx.strokeStyle = 'rgb(255, 255, 0)';

      var cpos = this.camera.get_component(Transform).get_position();
      this.scale = this.camera.get_component(CameraScale).scale;

      this.ctx.translate(
        -(cpos.x * this.scale - this.ctx.canvas.width/2),
        -(cpos.y * this.scale - this.ctx.canvas.height/2)
      );

      return true;
    }

    teardown() {
      this.ctx.restore();
    }


    _draw_target(e) {
      var pos = e.get_component(Transform).get_position().mul_f(this.scale);
      const width = 25;
      const py = pos.y;
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x,         py + width);
      this.ctx.lineTo(pos.x + width, py);
      this.ctx.lineTo(pos.x,         py - width);
      this.ctx.lineTo(pos.x - width, py);
      this.ctx.lineTo(pos.x,         py + width);
      this.ctx.moveTo(pos.x - width+5, pos.y + width - 8);
      this.ctx.lineTo(pos.x + width-5, pos.y + width - 8);
      this.ctx.stroke();
    }


    process_entity(entity) {
      var targeting = entity.get_component(Targeting);

      if (this.on) {
        for (var i=0; i<targeting._request_list.length; ++i) {
          this._draw_target(targeting._request_list[i][0]);
        }
      }

      for (var i=0; i<targeting._target_list.length; ++i) {
        let e = targeting._target_list[i];
        this._draw_target(e);

        var pos = e.get_component(Transform)
                   .get_position().mul_f(this.scale);
        let info = e.get_component(ShipInfo);
        let col = '';

        if (info.alliance === this.pinfo.alliance) {
          col = 'rgb(100, 255, 0)';
        } else if (info.alliance === Alliance.UNKNOWN) {
          col = 'rgb(255, 255, 0)';
        } else if (info.alliance === Alliance.NEUTRAL) {
          col = 'rgb(255, 255, 255)';
        } else {
          col = 'rgb(220, 50, 20)';
        }

        this.ctx.fillStyle = col;

        let yoffset = 13;
        let ty = pos.y - 13;
        let tx = pos.x + 32;
        let txt = [
          info.name,
          info.serial,
          'VEL: ' + Math.round(info.velocity) + ' m/s',
          'RNG: ' + Math.round(info.distance)/1000 + ' km'
        ];

        for (var j=0; j<txt.length; ++j) {
          this.ctx.fillText(txt[j], tx, ty + j*yoffset);
        }
      }
    }

  }

});
