define(function(require) {
  var Component = require('Component');

  /**
   * periastron = minor radii
   * apastron = major radii
   */

  return class PlanetInfoComponent extends Component {
    constructor(radius, name, apastron, periastron, centre) {
      super();
      this.radius = radius;
      this.name = name;
      this.periastron = periastron || 0;
      this.apastron = apastron || 0;
      this.centre = centre || new Vector(0,0);
    }
  }

});
