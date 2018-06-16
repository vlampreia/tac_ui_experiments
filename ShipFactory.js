define(function(require) {

  return class ShipFactory {
    make_ship(ecs) {
      var e = new ecs.get_entity_manager().create_entity();

      e.add_component(new RenderableComponent());
      e.add_component(new TransformComponent(0, 0));
      e.add_component(new ShipInfoComponent());
      e.add_component(new ShipTypeIconComponent());
      e.add_component(new AccelerationComponent());
      e.add_component(new WaypointComponent());

      return e;
    }
  }

});
