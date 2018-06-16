define(function(require) {
  var Component = require('Component');

  return class CameraScaleComponent extends Component {
    constructor(scale) {
      super();
      this.scale = scale;
    }
  }

});
