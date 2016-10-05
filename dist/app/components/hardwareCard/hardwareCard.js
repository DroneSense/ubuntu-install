System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var HardwareCard;
    return {
        setters:[],
        execute: function() {
            HardwareCard = (function () {
                function HardwareCard(bindings, stateService, mdDialog) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.mdDialog = mdDialog;
                    this.testChipNames = ['DJI Phantom 3'];
                }
                HardwareCard.prototype.showHardwareCard = function (id) {
                    this.mdDialog.show({
                        template: '<ds-hardware-card-detail></ds-hardware-card-detail>',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        escapeToClose: true
                    });
                };
                // Constructor
                HardwareCard.$inject = [
                    '$scope',
                    '$state',
                    '$mdDialog'
                ];
                return HardwareCard;
            }());
            exports_1("default",angular.module('DroneSense.Web.HardwareCard', []).component('dsHardwareCard', {
                bindings: {},
                controller: HardwareCard,
                templateUrl: './app/components/hardwareCard/HardwareCard.html'
            }));
        }
    }
});

//# sourceMappingURL=hardwareCard.js.map
