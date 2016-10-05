System.register(['../modelCard/modelCard', '../modelCardDetail/modelCardDetail'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var modelCard_1, modelCardDetail_1;
    var ModelViewer;
    return {
        setters:[
            function (modelCard_1_1) {
                modelCard_1 = modelCard_1_1;
            },
            function (modelCardDetail_1_1) {
                modelCardDetail_1 = modelCardDetail_1_1;
            }],
        execute: function() {
            ModelViewer = (function () {
                function ModelViewer(bindings, stateService, mdDialog) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.mdDialog = mdDialog;
                    console.log('3d Models constructor called ' + stateService.params['id']);
                    if (stateService.params['id']) {
                        this.showModelCard(stateService.params['id']);
                    }
                }
                ModelViewer.prototype.showModelCard = function (id) {
                    this.mdDialog.show({
                        template: '<ds-model-card-detail></ds-model-card-detail>',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        escapeToClose: true
                    });
                };
                // Constructor
                ModelViewer.$inject = [
                    '$scope',
                    '$state',
                    '$mdDialog'
                ];
                return ModelViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.ModelViewer', [
                modelCard_1.default.name,
                modelCardDetail_1.default.name
            ]).component('dsModelViewer', {
                bindings: {},
                controller: ModelViewer,
                templateUrl: './app/components/modelViewer/modelViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=modelViewer.js.map
