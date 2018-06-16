define(function(require) {
  //var ECS = require('ECS');

  return class Entity {
    constructor(ecs, id) {
      this.ecs = ecs;
      this.entity_mngr = this.ecs.get_entity_manager();
      this.id = id;
    }


    get_component(component_class) {
      return this.entity_mngr.get_component(this, component_class);
    }


    has_component(component_class) {
      return this.entity_mngr.has_component(this, component_class);
    }

    add_component(component) {
      this.entity_mngr.add_component(this, component);
    }

    get_id() {
      return this.id;
    }
  }

});
