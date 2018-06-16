define(function(require) {
  var ECS = require('ECS');
      EventManager = require('EventManager');

  return class Engine_1 {
    constructor(canvas_element) {
      this._event_mngr = new EventManager();

      this._canvas = canvas_element;
      this._ctx = this._canvas.getContext('2d');

      this._ecs = new ECS();
      this._render_systems = [];


      this._event_mngr.add_listener(
        EventType.RESIZE, this._resize_listener.bind(this)
      );
      this._event_mngr.add_listener(
        EventType.MOUSE_MOVE, this._mousemove_listener.bind(this)
      );
      this._event_mngr.add_listener(
        EventType.CONTEXT_MENU, this._contextmenu_listener.bind(this)
      );

      this._mouse_pos = new Vector(0,0);


      this._last_tick = 0;
      this._tick_length = 50;
      this._current_time = performance.now();
      this._accumulator = 0;

      this._update_db = null;
      this._render_ui_cb = null;
      this._render_bg_cb = null;

      this._resize_listener();
    }

    get_event_manager() {
      return this._event_mngr;
    }

    set_bg_render_callback(callback) {
      this._render_bg_cb = callback;
    }

    set_ui_render_callback(callback) {
      this._render_ui_cb = callback;
    }

    set_update_callback(callback) {
      this._update_cb = callback;
    }

    get_canvas_dims() {
      return new Vector(this._ctx.canvas.width, this._ctx.canvas.height);
    }

    main_loop() {
      var time_now = performance.now();
      var frame_time = time_now - this._current_time;
      this._current_time = time_now;

      this._accumulator += frame_time;

      let lt = performance.now();
      while (this._accumulator >= this._tick_length) {
        this._ecs.update(this._last_tick, this._tick_length);
        this._update_cb(this._last_tick, this._tick_length);
        this._accumulator -= this._tick_length;
        this._last_tick += this._tick_length;
      }
      lt = performance.now() - lt;

      let rt = performance.now();
      this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
      this._render_bg_cb(this._ctx);

      for (var i=0; i<this._render_systems.length; ++i) {
        this._render_systems[i].update();
      }

      this._render_ui_cb(this._ctx);

      this._ctx.fillStyle = 'rgb(255, 255, 255)';
      this._ctx.fillText('rt: ' + (performance.now() - rt), 10, 10);
      this._ctx.fillText('lt: ' + lt, 10, 23);

      window.requestAnimationFrame(this.main_loop.bind(this));
    }


    set_clear_color(color) {
      this._canvas.style.backgroundColor = color;
    }


    create_camera() {
      var camera = this._ecs.get_entity_manager().create_entity();
      camera.add_component(new TransformComponent(new Vector(0, 0)));
      camera.add_component(new TransformFollowComponent());
      camera.add_component(new CameraScaleComponent(1.0));

      this._camera = camera;
      return camera;
    }

    create_entity() {
      return this._ecs.get_entity_manager().create_entity();
    }


    screen_to_world_pos(screen_pos) {
      var scale = this._camera.get_component(CameraScaleComponent).scale;
      var centre = new Vector(
        this._ctx.canvas.width/2,
        this._ctx.canvas.height/2
      );

      var pos = this._camera.get_component(TransformComponent).get_position().mul_f(scale);
      return screen_pos.add_v(pos.sub_v(centre)).div_f(scale);
    }

    world_to_screen_pos(world_pos) {
      var scale = this._camera.get_component(CameraScaleComponent).scale;
      var centre = new Vector(
        this._ctx.canvas.width/2,
        this._ctx.canvas.height/2
      );

      var pos = this._camera.get_component(TransformComponent).get_position();
      return world_pos.mul_f(scale).sub_v(pos.mul_f(scale).sub_v(centre));
    }


    get_world_mouse_pos() {
      return this.screen_to_world_pos(this._mouse_pos);
    }

    add_render_system(system) {
      system.set_ctx(this._ctx);
      system.set_camera(this._camera);

      var sm  = this._ecs.get_system_manager();
      sm.add_system(system);
      this._render_systems.push(system);
      this._ecs.refresh(this._camera);
    }

    add_logic_system(system) {
      this._ecs.get_system_manager().add_system(system, true);
    }


    _resize_listener() {
      this._ctx.canvas.width = window.innerWidth;
      this._ctx.canvas.height = window.innerHeight;
    }

    _mousemove_listener(e) {
      this._mouse_pos.x = e.clientX;
      this._mouse_pos.y = e.clientY;
    }

    _contextmenu_listener(e) {
      e.preventDefault();
    }
  }

});
