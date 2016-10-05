System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DashboardViewer;
    return {
        setters:[],
        execute: function() {
            DashboardViewer = (function () {
                function DashboardViewer(bindings, stateService) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                }
                // Constructor
                DashboardViewer.$inject = [
                    '$scope',
                    '$state'
                ];
                return DashboardViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.DashboardViewer', []).component('dsDashboardViewer', {
                bindings: {},
                controller: DashboardViewer,
                templateUrl: './app/components/dashboardViewer/dashboardViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=dashboardViewer.js.map
