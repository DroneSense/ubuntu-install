System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ModelCard;
    return {
        setters:[],
        execute: function() {
            ModelCard = (function () {
                function ModelCard(bindings, stateService, mdDialog) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.mdDialog = mdDialog;
                    this.testChipNames = ['Towers', 'London', 'Landmarks'];
                }
                ModelCard.prototype.showModelCard = function (id) {
                    this.mdDialog.show({
                        template: '<ds-model-card-detail></ds-model-card-detail>',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        escapeToClose: true
                    });
                };
                // Constructor
                ModelCard.$inject = [
                    '$scope',
                    '$state',
                    '$mdDialog'
                ];
                return ModelCard;
            }());
            exports_1("default",angular.module('DroneSense.Web.ModelCard', []).component('dsModelCard', {
                bindings: {},
                controller: ModelCard,
                templateUrl: './app/components/modelCard/modelCard.html'
            }));
        }
    }
});

//# sourceMappingURL=modelCard.js.map
