define(function(require) {
  var System = require('System');

  var Targeting = require('TargetingComponent');

  return class TargetingSystem extends System {
    constructor() {
      super([Targeting]);
    }

    process_entity(entity) {
      var targeting = entity.get_component(Targeting);

      for (var i=0; i<targeting._request_list.length; ++i) {
        targeting._request_list[i][1] -= this._ecs._delta;
        if (targeting._request_list[i][1] > 0) continue;

        var e = targeting._request_list[i][0];
        targeting._request_list.splice(i, 1);
        targeting._target_list.push(e);
      }
    }
  }

});
