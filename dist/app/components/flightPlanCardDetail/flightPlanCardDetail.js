System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FlightPlanCardDetail;
    return {
        setters:[],
        execute: function() {
            FlightPlanCardDetail = (function () {
                function FlightPlanCardDetail(bindings, stateService, dataService) {
                    // TODO: retrieve flight plan from dataService
                    var _this = this;
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.dataService = dataService;
                    this.flightInfo = true;
                    this.owners = [];
                    this.editNotes = false;
                    // Check to see if a flight plan has been passed in, 
                    // else load it from dataService
                    if (!this.flightPlan) {
                    }
                    this.dataService.getAccountFlightPlanTags().then(function (tags) {
                        _this.tags = tags;
                    });
                    this.dataService.getCurrentAccount().then(function (account) {
                        _this.account = account;
                    });
                }
                FlightPlanCardDetail.prototype.tagSearch = function (text) {
                    var results = text ? this.tags.filter(this.createFilterFor(text)) : [];
                    return results;
                };
                FlightPlanCardDetail.prototype.createFilterFor = function (text) {
                    var lowercaseQuery = angular.lowercase(text);
                    return function filterFn(tag) {
                        return (tag.Name.toLowerCase().indexOf(lowercaseQuery) === 0);
                    };
                };
                FlightPlanCardDetail.prototype.close = function () {
                };
                FlightPlanCardDetail.prototype.fly = function () {
                    this.stateService.go('control');
                };
                FlightPlanCardDetail.prototype.plan = function () {
                    this.stateService.go('flightplan');
                };
                // Constructor
                FlightPlanCardDetail.$inject = [
                    '$scope',
                    '$state',
                    'dataService'
                ];
                return FlightPlanCardDetail;
            }());
            exports_1("default",angular.module('DroneSense.Web.FlightPlanCardDetail', []).component('dsFlightPlanCardDetail', {
                bindings: {
                    flightPlan: '<'
                },
                controller: FlightPlanCardDetail,
                templateUrl: './app/components/flightPlanCardDetail/FlightPlanCardDetail.html'
            }));
        }
    }
});

//# sourceMappingURL=flightPlanCardDetail.js.map
