define(function(require) {
  var System = require('System');
      TransformComponent = require('TransformComponent');
      TransformFollowComponent = require('TransformFollowComponent');


  return class TransformFollowSystem extends System {
    constructor() {
      super([TransformComponent, TransformFollowComponent]);
    }


    process_entity(entity) {
      var entity_t = entity.get_component(TransformComponent);
      var target_t = entity.get_component(TransformFollowComponent);

      var pos = target_t.target.get_position().add_v(target_t.offset);
      entity_t.set_position(pos);

      var orientation = target_t.target.get_orientation();
      entity_t.set_orientation(orientation);
    }
  }

});
