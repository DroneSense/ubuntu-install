System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var HardwareCardDetail;
    return {
        setters:[],
        execute: function() {
            HardwareCardDetail = (function () {
                function HardwareCardDetail(bindings, stateService, mdDialog) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.mdDialog = mdDialog;
                    console.log('hardware plans constructor called ' + stateService.params['id']);
                }
                // Constructor
                HardwareCardDetail.$inject = [
                    '$scope',
                    '$state',
                    '$mdDialog'
                ];
                return HardwareCardDetail;
            }());
            exports_1("default",angular.module('DroneSense.Web.HardwareCardDetail', []).component('dsHardwareCardDetail', {
                bindings: {},
                controller: HardwareCardDetail,
                templateUrl: './app/components/hardwareCardDetail/hardwareCardDetail.html'
            }));
        }
    }
});

//# sourceMappingURL=hardwareCardDetail.js.map
