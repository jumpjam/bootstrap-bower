/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.11.2 - 2014-09-26
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.dropdown","ui.bootstrap.pagination","ui.bootstrap.tabs","ui.bootstrap.typeahead"])
  .config(["$provide", function ($provide) {
    /**
     * HACK decorates typeahead directive so that it won't focus the first element.
     * This is a temporary fix until ui-bootstrap provides this functionality built-in.
     * https://github.com/angular-ui/bootstrap/issues/908#issuecomment-49974953
     */
    $provide.decorator("typeaheadDirective", ["$delegate","$timeout",function($delegate,$timeout){

      var prevCompile = $delegate[$delegate.length -1].compile;
      $delegate[$delegate.length -1].compile = function(){
        var link = prevCompile.apply($delegate,Array.prototype.slice.call(arguments,0));

        return function(originalScope,elem,attr) {
          var result = link.apply(link,Array.prototype.slice.call(arguments,0));
          //the link creates a new child scope, we need to have access to that one.
          var scope = originalScope.$$childTail;
          var prevSelect = scope.select;

          scope.select = function(activeIdx){
            if (activeIdx < 0) {
              scope.matches = [];
              elem.attr('aria-expanded', false);
              $timeout(function() { elem[0].focus(); }, 0, false);
            } else {
              prevSelect.apply(scope, Array.prototype.slice.call(arguments, 0));
            }
          };
          //we don't have access to a function that happens after getMatchesAsync
          //so we need to listen on a consequence of that function
          scope.$watchCollection("matches",function(){
            if (attr.typeaheadFocusFirst === "false")
              scope.activeIdx = -1;
          });
          return result;
        }
      };
      return $delegate;
    }]);
  }]);

angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html","template/accordion/accordion.html","template/pagination/pager.html","template/pagination/pagination.html","template/tabs/tab.html","template/tabs/tabset.html","template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]);

