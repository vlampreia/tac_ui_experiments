define(function(require) {
  var Component = require('Component');

  return class ShipTypeIconComponent extends Component {
    constructor(draw_function) {
      super();
      this.draw = draw_function;
    }

  }

});
