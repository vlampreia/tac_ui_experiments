define(function(require) {
  var System = require('System');
      ECS = require('ECS');

  return class SystemManager {
    constructor(ecs) {
      this._ecs = ecs;
      this._systems = [];
      this._systems_to_update = [];
    }


    add_system(system, auto_update=false) {
      for (var i=0; i<this._systems.length; ++i) {
        if (this._systems[i] ==  system) return;
      }

      this._systems.push(system);

      if (auto_update) this._systems_to_update.push(system);

      system.set_ecs(this._ecs);
    }


    get_system(type) {
      for (var i=0; i<this._systems.length; ++i) {
        if (this._systems[i] instanceof type) {
          return this._systems[i];
        }
      }

      return null;
    }


    set_update(system, update) {
      throw new Error('not implemented lol');
    }


    update(t, dt) {
      for (var i=0; i<this._systems_to_update.length; ++i) {
        this._systems_to_update[i].update();
      }
    }


    refresh(entity) {
      //TODO: optimize this using bitmask
      for (var i=0; i<this._systems.length; ++i) {
        this._systems[i].offer_entity(entity);
      }
    }

  }

});
