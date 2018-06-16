define(function(require) {
  var System = require('System');

  var TransformComponent = require('TransformComponent');
      ShipInfoComponent = require('ShipInfoComponent');

  return class VelocityInfoSystem extends System {
    constructor() {
      super([TransformComponent, ShipInfoComponent]);
    }

    process_entity(entity) {
      var transf = entity.get_component(TransformComponent);
      var info = entity.get_component(ShipInfoComponent);

      var velocity = transf.get_position().sub_v(transf.get_previous_pos());
      var tvel = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2));

      info.velocity = tvel;
    }
  }

});
