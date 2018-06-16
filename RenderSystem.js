define(function(require) {
  var System = require('System');
      TransformComponent = require('TransformComponent');
      RenderableComponent = require('RenderableComponent');
      TransformFollow = require('TransformFollowComponent');

  return class RenderSystem extends System {
    constructor(ctx, camera) {
      super([TransformComponent, RenderableComponent]);

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
      this.cpos = this.active_camera.get_component(TransformComponent).get_position();
      this.scale = this.active_camera.get_component(CameraScaleComponent).scale;

      //this.ctx.translate(
      //  -(this.cpos.x*this.scale - this.ctx.canvas.width/2),
      //  -(this.cpos.y*this.scale - this.ctx.canvas.height/2)
      //);
      //this.ctx.scale(this.scale, this.scale);

      this.ctx.fillStyle = 'rgb(0, 255, 255)';
      this.ctx.fillRect(0, 0, 3, 3);

      return true;
    }

    teardown() {
      this.ctx.restore();
    }


    process_entity(entity) {
      var renderable = entity.get_component(RenderableComponent);
      var transform = entity.get_component(TransformComponent);

      var pos = transform.get_position();
      var rot = transform.get_orientation();

      this.ctx.save();
//
//      if (entity.has_component(TransformFollow)) {
//        var f = entity.get_component(TransformFollow);
//        pos = pos.add_v(f.target.get_position());
//        rot = rot.add_v(f.target.get_orientation_v());
//      }

      this.ctx.translate(
        -((this.cpos.x*this.scale) - this.ctx.canvas.width/2) + pos.x*this.scale,
        -((this.cpos.y*this.scale) - this.ctx.canvas.height/2)+ pos.y*this.scale

        //-((this.cpos.x*this.scale - pos.x*this.scale)- this.ctx.canvas.width/2),
        //-((this.cpos.y*this.scale - pos.y*this.scale)- this.ctx.canvas.height/2)
      );
      this.ctx.rotate(rot);
      this.ctx.scale(this.scale, this.scale);

      renderable.draw(this.ctx, new Vector(0,0), 1);

      this.ctx.restore();

//      this.ctx.fillStyle = 'rgb(255, 0, 255)';
//
//      this.ctx.fillRect(pos.x-15, pos.y-15, 30, 30);
    }
  }

});
