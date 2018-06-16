define(function(require) {
  var System = require('System');
      TransformComponent = require('TransformComponent');
      AccelerationComponent = require('AccelerationComponent');
      Vector = require('Vector');


  return class ShipMotionSystem extends System {
    constructor() {
      super([TransformComponent, AccelerationComponent]);
    }


    process_entity(entity) {
      var acceleration = entity.get_component(AccelerationComponent);
      var transform = entity.get_component(TransformComponent);

      var velocity = transform.get_position()
                              .sub_v(transform.get_previous_pos());

      var pos = transform.get_position();

      pos = pos.add_v(velocity)
               .add_v(acceleration.get_vector().div_f(this._ecs._delta));

      transform.set_position(pos);
    }
  }

});
