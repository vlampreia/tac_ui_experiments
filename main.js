'use strict';

function isObjectInList(list, object) {
  for (var i=0; i<list.length; ++i) {
    if (list[i] === object) return true;
  }
  return false;
}

require(['domReady', 'Game'], function(domReady, Game) {
  var game = new Game();

  domReady(function() {
    game.run();
  });

});
