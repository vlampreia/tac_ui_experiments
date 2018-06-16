define(function(require) {
  var System = require('System');

  var TransformComponent = require('TransformComponent');
      ShipInfoComponent = require('ShipInfoComponent');


  return class ShipDistanceInfoSystem extends System {
    constructor() {
      super([TransformComponent, ShipInfoComponent]);

      this.rel_pos = null;
    }

    set_relative_position(position) {
      this.rel_pos = position;
    }

    process_entity(entity) {
      var pos = entity.get_component(TransformComponent).get_position();
      var info = entity.get_component(ShipInfoComponent);

      var len = pos.sub_v(this.rel_pos.get_position()).getMagnitude();
      //TODO; this should be selectable during construction, maybe...
      info.distance = len;
    }
  }

});
