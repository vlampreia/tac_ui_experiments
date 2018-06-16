define(function(require, exports) {
  var EntityManager = require('EntityManager');
      SystemManager = require('SystemManager');


  return class ECS {
    constructor() {
      this._entity_mngr = new EntityManager(this);
      this._system_mngr = new SystemManager(this);
      this._delta = 1;
      this._time = 1;
    }


    refresh(entity) {
      this._system_mngr.refresh(entity);
    }


    create_entity() {
      return this._entity_mngr.create_entity();
    }

    get_entity_manager() {
      return this._entity_mngr;
    }

    get_system_manager() {
      return this._system_mngr;
    }


//    get_delta() {
//      return this._delta;
//    }
//
//    set_delta(dt) {
//      this._delta = dt;
//    }


    update(t, dt) {
      this._delta = dt;
      this._time = t;
      this._system_mngr.update(t, dt);
    }
  }


});
