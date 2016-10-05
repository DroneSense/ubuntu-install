System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var KeyEnterDirective;
    return {
        setters:[],
        execute: function() {
            KeyEnterDirective = (function () {
                function KeyEnterDirective() {
                    this.restrict = 'A';
                    this.scope = false;
                    this.link = this.unboundLink.bind(this);
                }
                KeyEnterDirective.prototype.unboundLink = function (scope, element, attributes) {
                    element.bind('keydown keypress', function (event) {
                        if (event.which === 13) {
                            scope.$apply(function () {
                                scope.$eval(attributes.keyEnter);
                            });
                            event.preventDefault();
                            element.blur();
                        }
                    });
                };
                KeyEnterDirective.instance = function () {
                    var directive = function () { return new KeyEnterDirective(); };
                    directive.$inject = [];
                    return directive;
                };
                return KeyEnterDirective;
            }());
            exports_1("default",angular.module('DroneSense.Web.KeyEnter', []).directive('keyEnter', KeyEnterDirective.instance()));
        }
    }
});

//# sourceMappingURL=dsEnterKey.js.map
