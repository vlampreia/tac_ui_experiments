define(function(require) {
  var Component = require('Component');

  return class TargetingComponent extends Component {
    constructor() {
      super()

      this._request_list = [];
      this._target_list = [];
    }

    request_or_cancel_target(e) {
      var idx = this._target_list.indexOf(e);
      if (idx > -1) {
        this._target_list.splice(idx, 1);
      } else {
        this.request_target(e);
      }
    }

    request_target(e) {
      for (var i=0; i<this._request_list.length; ++i) {
        if (this._request_list[i][0] === e) return;
      }

      var idx = this._target_list.indexOf(e);
      if (idx > -1) return;

      this._request_list.push([e, 2000]);
    }

    remove_target(e) {
      var idx = this._target_list.indexOf(e);
      if (idx == -1) return;
      this._target_list.splice(idx, 1);
    }

    is_targeted(e) {
      return (this._target_list.indexOf(e) > -1);
    }
  }

});
