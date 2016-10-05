System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ScheduleViewer;
    return {
        setters:[],
        execute: function() {
            ScheduleViewer = (function () {
                function ScheduleViewer(bindings, stateService) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    console.log('schedules constructor');
                }
                // Constructor
                ScheduleViewer.$inject = [
                    '$scope',
                    '$state'
                ];
                return ScheduleViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.ScheduleViewer', []).component('dsScheduleViewer', {
                bindings: {},
                controller: ScheduleViewer,
                templateUrl: './app/components/scheduleViewer/ScheduleViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=scheduleViewer.js.map
