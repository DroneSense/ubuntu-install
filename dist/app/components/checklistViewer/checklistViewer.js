System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ChecklistViewer;
    return {
        setters:[],
        execute: function() {
            ChecklistViewer = (function () {
                function ChecklistViewer(bindings, stateService) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                }
                // Constructor
                ChecklistViewer.$inject = [
                    '$scope',
                    '$state'
                ];
                return ChecklistViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.ChecklistViewer', []).component('dsChecklistViewer', {
                bindings: {},
                controller: ChecklistViewer,
                templateUrl: './app/components/checklistViewer/ChecklistViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=checklistViewer.js.map
