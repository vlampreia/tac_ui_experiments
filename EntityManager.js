define(function(require) {
  var Entity = require('Entity');
      ECS = require('ECS');


  /**
   * TODO: replace component registration with bitmask
   */

  return class EntityManager {
    constructor(ecs) {
      this._ecs = ecs;
      this._entities = [];
      this._components_by_type = {};
      this._next_id = 0;
      this._entity_component_cache = {};
    }


    create_entity() {
      var e = new Entity(this._ecs, this._next_id);
      this._next_id++;
      this._entities.push(e);
      return e;
    }


    get_component(entity, component_class) {
      var type = component_class.get_type();

      if (!(type in this._components_by_type)) return null;
      var components = this._components_by_type[type];
      return components[entity.get_id()] || null;
    }

    has_component(entity, component_class) {
      var type = component_class.get_type();

      if (!(type in this._components_by_type)) return false;
      var components = this._components_by_type[type];

      return (components[entity.get_id()] != undefined);
    }

    has_components(entity, component_classes) {
      for (var i=0; i<component_classes.length; ++i) {
        if (!this.has_component(entity, component_classes[i])) return false;
      }

      return true;
    }

    get_entities_with_components(component_classes) {
      if (component_classes in this._entity_component_cache) {
        return this._entity_component_cache[component_classes];
      }

      var entities = [];

      for (var i=0; i<this._entities.length; ++i) {
        if (this.has_components(this._entities[i], component_classes)) {
          entities.push(this._entities[i]);
        }
      }

      this._entity_component_cache[component_classes] = entities;

      return entities;
    }


    add_component(entity, component) {
      if (entity === null) throw new Error();
      if (component === null) throw new Error();

      if (!(component.get_type() in this._components_by_type)) {
        this._components_by_type[component.get_type()] = {};
      }

      var clist = this._components_by_type[component.get_type()];
      clist[entity.get_id()] = component;

      this._ecs.refresh(entity);
    }
  }


});
