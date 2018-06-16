define(function(require) {
  var System = require('System');

  var PlanetInfo = require('PlanetInfoComponent');
      Transform = require('TransformComponent');

  return class PlanetaryOrbitSystem extends System {
    constructor() {
      super([PlanetInfo, Transform]);
    }

    setup() {
      return true;
    }

    teardown() {

    }

    process_entity(entity) {
      let transf = entity.get_component(Transform);
      let info = entity.get_component(PlanetInfo);

      let x = info.apastron   * Math.cos(this._ecs._time/4);
      let y = info.periastron * Math.sin(this._ecs._time/4);

      transf.set_position(info.centre.add_v(new Vector(x, y)));
    }
  }

});
