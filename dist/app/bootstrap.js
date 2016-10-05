System.register(['./app'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var app_1;
    return {
        setters:[
            function (app_1_1) {
                app_1 = app_1_1;
            }],
        execute: function() {
            angular.element(document).ready(function () {
                angular.bootstrap(document, [app_1.default.name], { strictDi: true });
            });
        }
    }
});

//# sourceMappingURL=bootstrap.js.map
