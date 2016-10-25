System.register(['../userAvatar/userAvatar'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var userAvatar_1;
    var FlightPlanCard;
    return {
        setters:[
            function (userAvatar_1_1) {
                userAvatar_1 = userAvatar_1_1;
            }],
        execute: function() {
            FlightPlanCard = (function () {
                function FlightPlanCard(bindings, stateService, mdDialog, db) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.mdDialog = mdDialog;
                    this.db = db;
                }
                FlightPlanCard.prototype.$onInit = function () {
                    var _this = this;
                    // Listen for flight plan changes
                    this.flightPlan.on('propertyChanged', function (property, value) {
                        _this.bindings.$applyAsync();
                    });
                };
                FlightPlanCard.prototype.$onDestroy = function () {
                    // Un-wire flight plan change listener
                    this.flightPlan.off();
                };
                FlightPlanCard.prototype.showFlightPlanCard = function (id) {
                    this.mdDialog.show({
                        template: '<ds-flight-plan-card-detail flight-plan="$ctrl.flightPlan"></ds-flight-plan-card-detail>',
                        scope: this.bindings,
                        preserveScope: true,
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        escapeToClose: true
                    });
                };
                FlightPlanCard.prototype.fly = function () {
                    this.stateService.go('control');
                };
                // Constructor
                FlightPlanCard.$inject = [
                    '$scope',
                    '$state',
                    '$mdDialog',
                    'db'
                ];
                return FlightPlanCard;
            }());
            exports_1("default",angular.module('DroneSense.Web.FlightPlanCard', [
                userAvatar_1.default.name
            ]).component('dsFlightPlanCard', {
                bindings: {
                    flightPlan: '<'
                },
                controller: FlightPlanCard,
                templateUrl: './app/components/flightPlanCard/flightPlanCard.html'
            }));
        }
    }
});

//# sourceMappingURL=flightPlanCard.js.map
