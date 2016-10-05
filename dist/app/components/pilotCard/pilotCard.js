System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PilotCard;
    return {
        setters:[],
        execute: function() {
            PilotCard = (function () {
                function PilotCard(bindings, stateService, mdDialog) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.mdDialog = mdDialog;
                    this.testChipNames = ['Owner', 'Pilot'];
                }
                PilotCard.prototype.showPilotCard = function (id) {
                    this.mdDialog.show({
                        template: '<ds-pilot-card-detail></ds-pilot-plan-card-detail>',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        escapeToClose: true
                    });
                };
                // Constructor
                PilotCard.$inject = [
                    '$scope',
                    '$state',
                    '$mdDialog'
                ];
                return PilotCard;
            }());
            exports_1("default",angular.module('DroneSense.Web.PilotCard', []).component('dsPilotCard', {
                bindings: {},
                controller: PilotCard,
                templateUrl: './app/components/pilotCard/pilotCard.html'
            }));
        }
    }
});

//# sourceMappingURL=pilotCard.js.map
