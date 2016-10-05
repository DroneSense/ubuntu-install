System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ModelCardDetail;
    return {
        setters:[],
        execute: function() {
            ModelCardDetail = (function () {
                function ModelCardDetail(bindings, stateService, mdDialog) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.mdDialog = mdDialog;
                    console.log('model plans constructor called ' + stateService.params['id']);
                }
                // Constructor
                ModelCardDetail.$inject = [
                    '$scope',
                    '$state',
                    '$mdDialog'
                ];
                return ModelCardDetail;
            }());
            exports_1("default",angular.module('DroneSense.Web.ModelCardDetail', []).component('dsModelCardDetail', {
                bindings: {},
                controller: ModelCardDetail,
                templateUrl: './app/components/modelCardDetail/modelCardDetail.html'
            }));
        }
    }
});

//# sourceMappingURL=modelCardDetail.js.map
