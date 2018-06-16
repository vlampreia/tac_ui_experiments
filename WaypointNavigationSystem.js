define(function(require) {
  var System = require('System');

  var WaypointComponent = require('WaypointComponent');
      AccelerationComponent = require('AccelerationComponent');
      TransformComponent = require('TransformComponent');


  return class WaypointNavigationSystem extends System {
    constructor() {
      super([WaypointComponent, AccelerationComponent, TransformComponent]);
    }

    process_entity(entity) {
      var waypoint = entity.get_component(WaypointComponent);
      if (!waypoint.is_active()) return;

      var accel = entity.get_component(AccelerationComponent);
      var transf = entity.get_component(TransformComponent);

      var dpos = waypoint.get_position().sub_v(transf.get_position());
      var distance = Math.sqrt(Math.pow(dpos.x, 2), Math.pow(dpos.y, 2));


      var total_dist = transf.get_position().sub_v(waypoint._start).getMagnitude();

//      if (distance <= total_dist/2) {
//        accel.set_acceleration(accel.get_acceleration().mul_f(-1*total_dist/distance));
//      }

      //if (distance < 100) {
      //  waypoint.set_active(false);
      //  //accel.set_acceleration(new Vector(0, 0));
      //}

      dpos = dpos.normalize();

      accel.set_acceleration(dpos.mul_f(5.0));
    }
  }

});
