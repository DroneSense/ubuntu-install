System.register(['../pilotCard/pilotCard'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var pilotCard_1;
    var PilotViewer;
    return {
        setters:[
            function (pilotCard_1_1) {
                pilotCard_1 = pilotCard_1_1;
            }],
        execute: function() {
            PilotViewer = (function () {
                function PilotViewer(bindings, stateService) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                }
                // Constructor
                PilotViewer.$inject = [
                    '$scope',
                    '$state'
                ];
                return PilotViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.PilotViewer', [
                pilotCard_1.default.name
            ]).component('dsPilotViewer', {
                bindings: {},
                controller: PilotViewer,
                templateUrl: './app/components/pilotViewer/pilotViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=pilotViewer.js.map
