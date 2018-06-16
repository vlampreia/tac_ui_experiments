define(function(require) {
  var Component = require('Component');
      TransformComponent = require('TransformComponent');


  return class TransformFollowComponent extends Component {
    constructor(target_transform, offset) {
      super();

      this.target = target_transform || null;
      this.offset = offset || new Vector(0, 0);
    }

    set_target(target) {
      this.target = target;
    }
  }

});
