System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Test;
    return {
        setters:[],
        execute: function() {
            Test = (function () {
                // Take a list of tools and load
                function Test(bindings) {
                    this.bindings = bindings;
                }
                // Constructor
                Test.$inject = [
                    '$scope'
                ];
                return Test;
            }());
            exports_1("default",angular.module('DroneSense.Web.Test', []).component('dsTest', {
                bindings: {},
                controller: Test,
                templateUrl: './app/components/test/test.html'
            }));
        }
    }
});

//# sourceMappingURL=test.js.map
