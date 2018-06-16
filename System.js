define(function(require) {

  return class System {
    constructor(component_types) {
      this._ecs = null;
      this._entities = [];
      this._interested_types = [];

      for (var i=0; i<component_types.length; ++i) {
        this._interested_types.push(component_types[i]);
      }

      if (new.target == System) {
        throw new TypeError();
      }
      if (this.process_entity === undefined) {
        throw new TypeError();
      }
    }


    set_ecs(ecs) {
      this._ecs = ecs;
    }


    update() {
      var cont = this.setup();
      if (!cont) return;
      this.process_entities(this._entities);
      this.teardown();
    }

    setup() {return true;}
    teardown() {}
    //process_entity(entity) {}

    process_entities(entities) {
      for (var i=0; i<entities.length; ++i) {
        this.process_entity(entities[i]);
      }
    }


    offer_entity(entity) {
      for (var i=0; i<this._interested_types.length; ++i) {
        var e = entity.get_component(this._interested_types[i]);
        if (entity.get_component(this._interested_types[i]) == null) {
          return;
        }
      }

      for (var i=0; i<this._entities.length; ++i) {
        if (this._entities[i] == entity) return;
      }

      this._entities.push(entity);
    }
  }

});
