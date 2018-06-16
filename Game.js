define(function(require) {
  var ECS = require('ECS');
      KeyCodes = require('KeyCodes');
      Engine = require('Engine');

      RenderSystem = require('RenderSystem');
      PlanetTacUIRenderSystem = require('PlanetTacUIRenderSystem');
      VelocityInfoSystem = require("VelocityInfoSystem");
      SpatialUiRenderSystem = require('SpatialUiRenderSystem');
      TransformFollowSystem = require('TransformFollowSystem');
      WaypointNavigationSystem = require('WaypointNavigationSystem');
      ShipMotionSystem = require('ShipMotionSystem');
      WaypointRenderSystem = require('WaypointRenderSystem');
      ShipDistanceInfoSystem = require('ShipDistanceInfoSystem');
      ShipTableSystem = require('ShipTableSystem');
      SensorSystem = require('SensorSystem');
      SensorOverlayRenderSystem = require('SensorOverlayRenderSystem');
      TargetingSystem = require('TargetingSystem');
      TargetingUISystem = require('TargetingUISystem');
      PlanetaryOrbitSystem = require('PlanetaryOrbitSystem');

      WaypointComponent = require('WaypointComponent');
      PlanetInfoComponent = require('PlanetInfoComponent');
      TransformComponent = require('TransformComponent');
      TransformFollowComponent = require('TransformFollowComponent');
      CameraScaleComponent = require('CameraScaleComponent');
      ShipInfoComponent = require('ShipInfoComponent');
      SensorComponent = require('SensorComponent');
      TargetingComponent = require('TargetingComponent');
      PlayerComponent = require('PlayerComponent');
      HullInfoComponent = require('HullInfoComponent');

      Vector = require('Vector');

      Alliance = require('Alliance');
      ShipType = require('ShipType');

      EventManager = require('EventManager')
      EventType = require('EventType');

      TableElement = require('TableElement');


  const AU_TO_M = 149597870700;


  function get_random_range(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function trunc_decimal(number, dec) {
    return Math.round(number*dec)/dec;
  }

  function draw_icon_player(ctx, pos) {
    ctx.strokeStyle = 'rgb(100, 200, 255)';
    ctx.beginPath();
    ctx.moveTo(pos.x,      pos.y);
    ctx.lineTo(pos.x + 25, pos.y);
    ctx.moveTo(pos.x,      pos.y);
    ctx.lineTo(pos.x,      pos.y+40);
    ctx.stroke();
  }

  function draw_icon_small(ctx, pos) {
    ctx.beginPath();
    ctx.moveTo(pos.x-10,   pos.y + 10);
    ctx.lineTo(pos.x,      pos.y);
    ctx.lineTo(pos.x,      pos.y - 10);
    ctx.moveTo(pos.x,      pos.y);
    ctx.lineTo(pos.x + 10, pos.y + 10);
    ctx.stroke();
  }

  function draw_icon_medium(ctx, pos) {
    ctx.beginPath();
    ctx.moveTo(pos.x-12, pos.y+8);
    ctx.lineTo(pos.x,    pos.y-12);
    ctx.lineTo(pos.x+12, pos.y+8);
    ctx.lineTo(pos.x-12, pos.y+8);
    ctx.stroke();
  }

  function draw_icon_large(ctx, pos) {
    ctx.beginPath();
    ctx.moveTo(pos.x - 5,  pos.y - 10);
    ctx.lineTo(pos.x + 15, pos.y - 10);
    ctx.lineTo(pos.x + 5,  pos.y + 10);
    ctx.lineTo(pos.x - 15, pos.y + 10);
    ctx.lineTo(pos.x - 5 , pos.y - 10);
    ctx.stroke();
  }

  return class Game_1 {
    constructor() {
      this._engine = new Engine(document.getElementById('canvas'));

      this.scales = [0.01, 0.1, 1.0];
      this.scales_idx = 0;
      this._camera = this._engine.create_camera();
      this._camera.get_component(CameraScaleComponent).scale = 0.01;

      this.ship_table = new TableElement(new Vector(10, 40));
      this.ship_table.add_column('name', 120);
      this.ship_table.add_column('reg', 80);
      this.ship_table.add_column('class', 60);
      this.ship_table.add_column('vel', 50);
      this.ship_table.add_column('range', 100);
      this.ship_table.add_column('azm', 60);
      this.ship_table.add_column('sig', 50);

      this._engine.add_render_system(new RenderSystem());
      this._engine.add_render_system(new SensorOverlayRenderSystem());
      this._engine.add_render_system(new PlanetTacUIRenderSystem());
      this._engine.add_render_system(new SpatialUiRenderSystem());
      this._engine.add_render_system(new TargetingUISystem());
      this._engine.add_render_system(new WaypointRenderSystem());

      this._engine.add_logic_system(new TransformFollowSystem());
      this._engine.add_logic_system(new ShipMotionSystem());
      this._engine.add_logic_system(new WaypointNavigationSystem());
      this._engine.add_logic_system(new VelocityInfoSystem());
      this._engine.add_logic_system(new ShipDistanceInfoSystem());
      this._engine.add_logic_system(new ShipTableSystem(this.ship_table));
      this._engine.add_logic_system(new SensorSystem());
      this._engine.add_logic_system(new TargetingSystem());
      this._engine.add_logic_system(new PlanetaryOrbitSystem());

      this._engine._ecs.refresh(this._camera);

      this._engine.set_bg_render_callback(this._render_bg.bind(this));
      this._engine.set_ui_render_callback(this._render_ui.bind(this));
      this._engine.set_update_callback(this._update_cb.bind(this));

      var em = this._engine.get_event_manager();
      em.add_listener(EventType.DOUBLE_CLICK, this._mouse_dbl_listener.bind(this));
      em.add_listener(EventType.MOUSE_DOWN, this._mousedown_listener.bind(this));
      em.add_listener(EventType.MOUSE_UP, this._mouseup_listener.bind(this));
      em.add_listener(EventType.KEY_DOWN, this._keydown_listener.bind(this));
      em.add_listener(EventType.KEY_UP, this._keyup_listener.bind(this));
      em.add_listener(EventType.SCROLL, this._scroll_listener.bind(this));


      this._cursor_object = null;

      this._starfield = [[], [], [], []];
      var dims = this._engine.get_canvas_dims();
      for (var i=0; i<1000; ++i) {
        this._starfield[0].push(new Vector(
            Math.random() * dims.x,
            Math.random() * dims.y
        ));
      }
      for (var i=0; i<5000; ++i) {
        this._starfield[1].push(new Vector(
            Math.random() * dims.x,
            Math.random() * dims.y
        ));
      }
      for (var i=0; i<10000; ++i) {
        this._starfield[2].push(new Vector(
            Math.random() * dims.x,
            Math.random() * dims.y
        ));
      }
      for (var i=0; i<500; ++i) {
        this._starfield[3].push(new Vector(
            Math.random() * dims.x,
            Math.random() * dims.y
        ));
      }

      this._engine.set_clear_color('rgb(10, 10, 10)');
      this._engine.set_clear_color('rgb(3, 3, 5)');

      this.set_tracking_object = false;

      this._is_sensor_visible = false;

      this._edit_sensor = false;
      this._player_sensor = null;
    }


    run() {
      var e = this._engine.create_entity();
      e.add_component(new RenderableComponent());
      var transf = new TransformComponent(new Vector(5000, 10));
      transf.set_orientation_deg(45);
      e.add_component(transf);
      e.add_component(new ShipInfoComponent(
        'HMS token', 'NTS123123', Alliance.GOOD_GUYS,
        ShipType.SMALL
      ));
      e.add_component(new AccelerationComponent());
      e.add_component(new WaypointComponent());
      e.add_component(new TargetingComponent());
      e.add_component(new PlayerComponent());

      this._player_e = e;

      // hull
      function draw_hull(ctx, pos, scale) {
        ctx.fillStyle = 'rgb(40, 40, 40)';
        ctx.fillRect(pos.x-100, pos.y-25, 200, 50);
      };
      e = this._engine.create_entity();
      var renderable = new RenderableComponent();
      renderable.set_draw_function(draw_hull);
      e.add_component(renderable);
      var t = new TransformComponent(0, 0);
      t.set_parent(this._player_e.get_component(TransformComponent));
      e.add_component(t);
      //e.add_component(new TransformFollowComponent(
      //  this._player_e.get_component(TransformComponent)
      //));
      e.add_component(new HullInfoComponent());

      // sensor
      function draw_sensor(ctx, pos, scale) {
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.fillRect(pos.x - 10, pos.y-5, 20, 10);
      }
      var e = this._engine.create_entity();
      var t = new TransformComponent(new Vector(50, 0));
      t.set_parent(this._player_e.get_component(TransformComponent));
      e.add_component(t);
      renderable = new RenderableComponent();
      renderable.set_draw_function(draw_sensor);
      e.add_component(renderable);
      //e.add_component(new TransformFollowComponent(
      //  this._player_e.get_component(TransformComponent),
      //  new Vector(50, 0)
      //));
      var s = new SensorComponent();
      s.set_range(6 * AU_TO_M);
      s.set_noise_floor(0.15);
      s.set_spread_deg(45);
      s.set_resolution(2);
      e.add_component(s);

      this._player_sensor = e;


      this._engine._ecs.get_system_manager()
                  .get_system(SpatialUiRenderSystem)
                  .set_player_entity(this._player_e);

      this._engine._ecs.get_system_manager()
                  .get_system(TargetingUISystem)
                  .set_player_entity(this._player_e);

      this._engine._ecs.get_system_manager()
                  .get_system(ShipDistanceInfoSystem)
                  .set_relative_position(this._player_e.get_component(TransformComponent));

      this._engine._ecs.get_system_manager()
                  .get_system(ShipTableSystem)
                  .set_player_ship(this._player_e);

      this._camera.get_component(TransformFollowComponent)
                  .set_target(this._player_e.get_component(TransformComponent));

      var ship_data = [
        [new Vector(-80000, 300000), 'distant man', Alliance.BAD_GUYS, ShipType.LARGE, draw_icon_large],
        [new Vector(20000, -8000), 'bad guy', Alliance.BAD_GUYS, ShipType.LARGE, draw_icon_large, new Vector(23000, -4000)],
        [new Vector(-20000, -5000), 'c', Alliance.UNKNOWN, ShipType.MEDIUM, draw_icon_medium, new Vector(0, 100)],
        [new Vector(50500, -5500), 'd', Alliance.GOOD_GUYS, ShipType.SMALL, draw_icon_small],
        [new Vector(5500, 5500), 'e', Alliance.GOOD_GUYS, ShipType.SMALL, draw_icon_small],
        [new Vector(-5500, -5500), 'a', Alliance.GOOD_GUYS, ShipType.SMALL, draw_icon_small],
        [new Vector(-100000, 400000), 'guy_1',  Alliance.GOOD_GUYS, ShipType.LARGE, draw_icon_large],
        [new Vector(900000, -100000), 'guy_2',  Alliance.BAD_GUYS,  ShipType.LARGE, draw_icon_large],
        [new Vector(-700000, 200000), 'guy_3',  Alliance.GOOD_GUYS, ShipType.SMALL, draw_icon_small],
        [new Vector(400000, 300000), 'guy_4',  Alliance.GOOD_GUYS, ShipType.SMALL, draw_icon_small],
        [new Vector(500000, 60000), 'guy_5',  Alliance.BAD_GUYS,  ShipType.SMALL, draw_icon_small],
        [new Vector(-800000, -100000), 'guy_6',  Alliance.BAD_GUYS,  ShipType.SMALL, draw_icon_small],
        [new Vector(-3000000, 200000), 'guy_7',  Alliance.BAD_GUYS,  ShipType.MEDIUM, draw_icon_medium],
        [new Vector(400000, -400000), 'guy_8',  Alliance.GOOD_GUYS, ShipType.MEDIUM, draw_icon_medium],
        [new Vector(20000, 3000), 'guy_9',  Alliance.GOOD_GUYS, ShipType.MEDIUM, draw_icon_medium],
        [new Vector(40000, 900000), 'guy_10', Alliance.GOOD_GUYS, ShipType.MEDIUM, draw_icon_medium]
      ];

      for (var i=0; i<100; ++i) {
        let x = Math.sign(0.5-Math.random()) * (1000000 + Math.random() * 100000000);
        let y = Math.sign(0.5-Math.random()) * (1000000 + Math.random() * 100000000);
        ship_data.push([
          new Vector(
            x, y
          ),
          'random_guy_'+i, Alliance.NEUTRAL,
          ShipType.SMALL, draw_icon_small,
          new Vector(
            x + Math.sign(0.5-Math.random()) * Math.random() * 100000000,
            y + Math.sign(0.5-Math.random()) * Math.random() * 100000000
          ),
        ]);
      }

      for (var i=0; i<ship_data.length; ++i) {
        let e = this._engine.create_entity();
        e.add_component(new RenderableComponent());
        e.add_component(new TransformComponent(ship_data[i][0]));
        e.add_component(new ShipInfoComponent(
          ship_data[i][1],
          ship_data[i][1][0] + '_' + Math.floor(Math.random()*100000),
          ship_data[i][2],
          ship_data[i][3]
        ));
        e.add_component(new ShipTypeIconComponent(ship_data[i][4]));
        e.add_component(new AccelerationComponent());

        if (ship_data[i].length > 5) {
          let wp = new WaypointComponent();
          wp.set_start_pos(ship_data[i][0]);
          wp.set_position(ship_data[i][5]);
          wp.set_active(true);
          e.add_component(wp);
        }
      }

      function draw_planet_radius(radius) {
        return function draw_planet(ctx, pos) {
          ctx.fillStyle = 'rgb(0, 0, 0)';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius, 0, 2*Math.PI);
          ctx.fill();
        }
      }

      //const offset = -152100000000;
      const offset = 1000000000;
      let centre = new Vector(offset, offset);

      e = this._engine.create_entity();
      var r = new RenderableComponent();
      r.set_draw_function(draw_planet_radius(2439700));
      e.add_component(r);
      e.add_component(new TransformComponent(new Vector(offset, offset)));
      e.add_component(new PlanetInfoComponent(2439700, 'Mercury', 69816900000, 46001200000, centre));

      e = this._engine.create_entity();
      var r = new RenderableComponent();
      r.set_draw_function(draw_planet_radius(6051800));
      e.add_component(r);
      e.add_component(new TransformComponent(new Vector(offset, offset)));
      e.add_component(new PlanetInfoComponent(6051800, 'Venus', 108939000000, 107477000000, centre));

      e = this._engine.create_entity();
      var r = new RenderableComponent();
      r.set_draw_function(draw_planet_radius(6371000));
      e.add_component(r);
      e.add_component(new TransformComponent(new Vector(offset, offset)));
      e.add_component(new PlanetInfoComponent(6371000, 'Earth', 152100000000, 147095000000, centre));

      e = this._engine.create_entity();
      var r = new RenderableComponent();
      r.set_draw_function(draw_planet_radius(3389500));
      e.add_component(r);
      e.add_component(new TransformComponent(new Vector(offset, offset)));
      e.add_component(new PlanetInfoComponent(3389500, 'Mars', 1.666*AU_TO_M, 1.3814*AU_TO_M, centre));

      e = this._engine.create_entity();
      var r = new RenderableComponent();
      r.set_draw_function(draw_planet_radius(69911000));
      e.add_component(r);
      e.add_component(new TransformComponent(new Vector(offset, offset)));
      e.add_component(new PlanetInfoComponent(69911000, 'Jupiter', 5.45492*AU_TO_M, 4.95029*AU_TO_M, centre));

      e = this._engine.create_entity();
      var r = new RenderableComponent();
      r.set_draw_function(draw_planet_radius(58232000));
      e.add_component(r);
      e.add_component(new TransformComponent(new Vector(offset, offset)));
      e.add_component(new PlanetInfoComponent(58232000, 'Saturn', 10.086*AU_TO_M, 9.024*AU_TO_M, centre));

      e = this._engine.create_entity();
      var r = new RenderableComponent();
      r.set_draw_function(draw_planet_radius(25362000));
      e.add_component(r);
      e.add_component(new TransformComponent(new Vector(offset, offset)));
      e.add_component(new PlanetInfoComponent(25362000, 'Uranus', 20.11*AU_TO_M, 18.33*AU_TO_M, centre));

      e = this._engine.create_entity();
      var r = new RenderableComponent();
      r.set_draw_function(draw_planet_radius(24622000));
      e.add_component(r);
      e.add_component(new TransformComponent(new Vector(offset, offset)));
      e.add_component(new PlanetInfoComponent(24622000, 'Neptune', 30.33*AU_TO_M, 29.81*AU_TO_M, centre));

      e = this._engine.create_entity();
      var r = new RenderableComponent();
      r.set_draw_function(draw_planet_radius(695700000));
      e.add_component(r);
      e.add_component(new TransformComponent(centre));
      e.add_component(new PlanetInfoComponent(695700000, 'Sol', 0, 0, centre));


      this._engine.main_loop();
    }

    _update_cb(t, dt) {
      if (this._edit_sensor) {
        let sensor_pos = this._player_sensor
                             .get_component(TransformComponent)
                             .get_position();

        let vec = this._engine.get_world_mouse_pos()
                      .sub_v(sensor_pos);

        this._player_sensor
            .get_component(TransformComponent)
            .set_orientation_v(vec);
      }

      this._camera.get_component(TransformComponent).set_position(
          this._player_e.get_component(TransformComponent).get_position()
      );
    }

    _draw_object_hover(ctx, obj) {
      var pos = this._engine.world_to_screen_pos(
        this._cursor_object.get_component(TransformComponent).get_position()
      );

      ctx.save();
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)';
      ctx.strokeRect(pos.x-20, pos.y-20, 40, 40);

      if (!this._player_e.get_component(TargetingComponent).is_targeted(obj)) {
        let info = obj.get_component(ShipInfoComponent);
        let col = '';
        let pinfo = this._player_e.get_component(ShipInfoComponent);

        if (info.alliance === pinfo.alliance) {
          col = 'rgb(100, 255, 0)';
        } else if (info.alliance === Alliance.UNKNOWN) {
          col = 'rgb(255, 255, 0)';
        } else if (info.alliance === Alliance.NEUTRAL) {
          col = 'rgb(255, 255, 255)';
        } else {
          col = 'rgb(220, 50, 20)';
        }

        ctx.fillStyle = col;

        let yoffset = 13;
        let ty = pos.y - 13;
        let tx = pos.x + 32;
        let txt = [
          info.name,
          info.serial,
          'VEL: ' + Math.round(info.velocity) + ' m/s',
          'RNG: ' + Math.round(info.distance)/1000 + ' km'
        ];

        for (var j=0; j<txt.length; ++j) {
          ctx.fillText(txt[j], tx, ty + j*yoffset);
        }
      }

      ctx.restore();
    }

    _draw_cursor(ctx, pos) {
      ctx.fillStyle = 'rgba(100, 200, 255, 0.5)';
      ctx.fillRect(pos.x - 20, pos.y - 0.5, 40, 2);
      ctx.fillRect(pos.x - 0.5, pos.y - 20, 2, 40);

      var origin = this._player_e.get_component(TransformComponent).get_position();
      var target = this._engine.get_world_mouse_pos();
      var distance = origin.sub_v(target).getMagnitude();

      var range = distance;
      if (range > AU_TO_M) {
        range = trunc_decimal(distance/AU_TO_M, 1000) + ' AU';
      } else {
        range = trunc_decimal(distance/1000, 1000) + ' km';
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(
        'RNG: ' + range,
        this._engine._mouse_pos.x + 10,
        this._engine._mouse_pos.y + 17
      );
    }

    _draw_crosshair(ctx, pos) {
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, pos.y + 0.5);
      ctx.lineTo(ctx.canvas.width, pos.y + 0.5);
      ctx.moveTo(pos.x + 0.5, 0);
      ctx.lineTo(pos.x + 0.5, ctx.canvas.height);
      ctx.stroke();
    }

    _draw_ranges(ctx) {
      var centre = this._engine.world_to_screen_pos(
          this._player_e
              .get_component(TransformComponent)
              .get_position()
      );
      var scale = this._camera.get_component(CameraScaleComponent).scale;
      //in km
      var ranges = [
        0.5, 1, 2, 3.5, 5,
        10, 20, 30, 40, 50,
        75, 100, 150, 250,
        375, 500, 650, 800
      ];
      //var ranges = [
      //  500, 1000, 2000, 3500, 5000,
      //  10000, 20000, 30000, 40000, 50000,
      //  75000, 100000, 150000, 250000
      //];

      ctx.fillStyle = 'rgba(100, 200, 255, 0.2)';
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.25)';

      ctx.fillRect(centre.x - 1, centre.y - 1, 3, 3);

      var x_pos_l = [];
      var starting_range = 0;

      for (var i=0; i<ranges.length; ++i) {
        var len = ranges[i]*1000*scale;
        x_pos_l.push(len + centre.x - 5);

        ctx.beginPath();
        ctx.arc(centre.x, centre.y, len, 0, 2*Math.PI);
        ctx.stroke();

        if (len < 100) ++starting_range;
      }

      var txt = [];
      for (var i=starting_range; i<ranges.length; ++i) {
        txt[i] = ranges[i];
        ctx.fillRect(
          x_pos_l[i] - 3, centre.y - 10,
          ctx.measureText(txt[i]).width + 9, 17
        );
      }

      ctx.font = '12px mono';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      for (var i=starting_range; i<ranges.length; ++i) {
        ctx.fillText(txt[i], x_pos_l[i], centre.y + 3)
      }
    }

    _toggle_camera_scale() {
      this.scales_idx = (this.scales_idx + 1) % this.scales.length;
      this._camera.get_component(CameraScaleComponent).scale =
        (this.scales[this.scales_idx]);
    }

    _find_cursor_object() {
      var entities = this._engine._ecs
                                 .get_entity_manager()
                                 .get_entities_with_components([
                                    TransformComponent,
                                    ShipInfoComponent
                                 ]);

      if (entities == []) return;
      var cam_pos = this._camera.get_component(TransformComponent).get_position();

      var cur_pos = this._engine._mouse_pos;
      var centre = new Vector(this._engine._ctx.canvas.width/2, this._engine._ctx.canvas.height/2);
      var scale = this._camera.get_component(CameraScaleComponent).scale;

      this._cursor_object = null;
      for (var i=0; i<entities.length; ++i) {
        var pos = entities[i].get_component(TransformComponent).get_position();
        pos = this._engine.world_to_screen_pos(pos);

        if (Math.abs(cur_pos.x - pos.x) >= 20) continue;
        if (Math.abs(cur_pos.y - pos.y) >= 20) continue;
        this._cursor_object = entities[i];
      }
    }

    _draw_ship_cursor_line(ctx, ship_pos, mouse_pos) {
      var ppos = this._engine.world_to_screen_pos(ship_pos);
      var tpos = mouse_pos.add_v(mouse_pos.sub_v(ppos).mul_f(1000));
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';

      ctx.beginPath();
      ctx.moveTo(ppos.x, ppos.y);
      ctx.lineTo(tpos.x, tpos.y);
      ctx.stroke();
    }

    _render_starfield(ctx) {
      ctx.save();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (var i=0; i<this._starfield[0].length; ++i) {
        ctx.fillRect(this._starfield[0][i].x, this._starfield[0][i].y, 1, 1);
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (var i=0; i<this._starfield[1].length; ++i) {
        ctx.fillRect(this._starfield[1][i].x, this._starfield[1][i].y, 1, 1);
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (var i=0; i<this._starfield[2].length; ++i) {
        ctx.fillRect(this._starfield[2][i].x, this._starfield[2][i].y, 1, 1);
      }

      ctx.fillStyle = 'rgba(255, 200, 50, 0.5)';
      for (var i=0; i<this._starfield[3].length; ++i) {
        ctx.fillRect(this._starfield[3][i].x, this._starfield[3][i].y, 1, 1);
      }

      ctx.restore();
    }

    _render_bg(ctx) {
      this._render_starfield(ctx);
      this._draw_ranges(ctx);
    }


    _draw_sensor(ctx) {
      var sensor = this._player_sensor.get_component(SensorComponent);

      //if (sensor.log.length == 0) return;

      var noise_y = (sensor.noise_floor);

      let values = sensor.signal;

      var max_sig = noise_y/2+noise_y+sensor.max_sig/2;

      var x = 600.5;
      var y = 20.5;
      var width = 200;
      var height = 100;
      var yp = y + height;

      ctx.strokeStyle = 'rgb(255, 255, 255)';
      ctx.strokeRect(x, y, width, height);
      ctx.beginPath();
      ctx.moveTo(x + 0.5 + width/2, y+height);
      ctx.lineTo(x + 0.5 + width/2, y+height+10);
      ctx.stroke();


      ctx.beginPath();
      for (var i=0; i<values.length; ++i) {
        ctx.lineTo(x + (i/values.length)*width, yp - (values[i]/max_sig) * height);
      }
      ctx.stroke();

      var tx = x + width + 20;
      var ty = y + 10;
      var yoffset = 15;
      var txt = [
        'azimuth: '    + sensor.azimuth,
        'range: '      + sensor.range,
        'noise: '      + sensor.noise_floor,
        'SNR: '        + trunc_decimal(sensor.max_sig/sensor.noise_floor, 1000),
        'spread: '     + trunc_decimal(sensor.spread, 1000),
        'resolution: ' + sensor.resolution
      ];

      for (var i=0; i<txt.length; ++i) {
        ctx.fillText(txt[i], tx, ty + i*yoffset);
      }
    }

    _draw_scale(ctx) {
      let scale = 1/this._camera.get_component(CameraScaleComponent).scale;
      ctx.fillText('scale: ' + trunc_decimal(scale, 10000), 300, 10);
    }

    _render_ui(ctx) {
      ctx.save();

      //this._draw_ranges(ctx);
      //TODO: this is shit
      this._find_cursor_object();

      this._draw_ship_cursor_line(
        ctx,
        this._player_e.get_component(TransformComponent).get_position(),
        this._engine._mouse_pos
      );

      this._draw_crosshair(ctx, this._engine._mouse_pos);
      if (this._cursor_object == null) {
        this._draw_cursor(ctx, this._engine._mouse_pos);
      } else {
        this._draw_object_hover(ctx, this._cursor_object);
      }

      this.ship_table.draw(ctx);

      if (this._is_sensor_visible) this._draw_sensor(ctx);

      this._draw_scale(ctx);

      ctx.restore();
    }

    set_player_destination(position) {
      var w = this._player_e.get_component(WaypointComponent);
      w.set_position(position);
      w._start = this._player_e
                      .get_component(TransformComponent)
                      .get_position();
      w.set_active(true);
    }

    set_camera_track_object(entity) {
      var tf = this._camera.get_component(TransformFollowComponent);

      if (entity == null) entity = this._player_e;

      tf.set_target(entity.get_component(TransformComponent));
    }

    _mouse_dbl_listener(e) {
      this.set_player_destination(this._engine.get_world_mouse_pos());
    }

    _mousedown_listener(e) {
      if (e.button == 0) {
        if (this.set_tracking_object) {
          this.set_camera_track_object(this._cursor_object);
          return;
        }

        if (this._cursor_object) {
          if (this.set_tracking_object) {
            this._camera.get_component(TransformFollowComponent)
                        .set_target(this._cursor_object.get_component(TransformComponent));
          } else {
            //target ship
            this._player_e.get_component(TargetingComponent).request_or_cancel_target(this._cursor_object);
          }
        } else {
          //
        }
      } else if (e.button == 2) {
        if (this._is_sensor_visible) {
          this._edit_sensor = true;
        }
      }
    }

    _mouseup_listener(e) {
      if (e.button == 2) {
        if (this._is_sensor_visible) {
          this._edit_sensor = false;
        }
      }
    }

    _keydown_listener(e) {
      if (e.repeat) return;

      switch (KeyCodes.toChar(e.keyCode)) {
        case ' ': this._toggle_camera_scale(); break;
        case 't': this.set_tracking_object = true; break;
        case 's': this.toggle_sensors(); break;

        default: break;
      }
    }

    _keyup_listener(e) {
      if (e.repeat) return;

      switch (KeyCodes.toChar(e.keyCode)) {
        case 't': this.set_tracking_object = false; break;

        default: break;
      }
    }

    _scroll_listener(e) {
      let delta = Math.sign(e.deltaY);

      if (this._edit_sensor) {
        let s = this._player_sensor.get_component(SensorComponent);
        s.inc_spread(delta);
      } else {
        var scale_comp = this._camera.get_component(CameraScaleComponent);
        scale_comp.scale -= delta/10 * scale_comp.scale;
      }
    }


    toggle_sensors() {
      this._is_sensor_visible = !this._is_sensor_visible;
      this._engine
          ._ecs
          .get_system_manager()
          .get_system(SensorOverlayRenderSystem)
          .toggle_visible();
    }
  }


});
