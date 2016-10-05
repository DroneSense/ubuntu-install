System.register(['../hardwareCard/hardwareCard', '../hardwareCardDetail/hardwareCardDetail'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var hardwareCard_1, hardwareCardDetail_1;
    var HardwareViewer;
    return {
        setters:[
            function (hardwareCard_1_1) {
                hardwareCard_1 = hardwareCard_1_1;
            },
            function (hardwareCardDetail_1_1) {
                hardwareCardDetail_1 = hardwareCardDetail_1_1;
            }],
        execute: function() {
            HardwareViewer = (function () {
                function HardwareViewer(bindings, stateService, mdDialog) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.mdDialog = mdDialog;
                    console.log('hardware constructor called ' + stateService.params['id']);
                    if (stateService.params['id']) {
                        this.showHardwareCard(stateService.params['id']);
                    }
                }
                HardwareViewer.prototype.showHardwareCard = function (id) {
                    this.mdDialog.show({
                        template: '<ds-hardware-card-detail></ds-hardware-card-detail>',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        escapeToClose: true
                    });
                };
                // Constructor
                HardwareViewer.$inject = [
                    '$scope',
                    '$state',
                    '$mdDialog'
                ];
                return HardwareViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.HardwareViewer', [
                hardwareCard_1.default.name,
                hardwareCardDetail_1.default.name
            ]).component('dsHardwareViewer', {
                bindings: {},
                controller: HardwareViewer,
                templateUrl: './app/components/hardwareViewer/hardwareViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=hardwareViewer.js.map
