System.register(['../userAvatar/userAvatar', '../../services/commonData'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var userAvatar_1, commonData_1;
    var ProfileViewer;
    return {
        setters:[
            function (userAvatar_1_1) {
                userAvatar_1 = userAvatar_1_1;
            },
            function (commonData_1_1) {
                commonData_1 = commonData_1_1;
            }],
        execute: function() {
            ProfileViewer = (function () {
                function ProfileViewer(bindings, stateService, dataService) {
                    var _this = this;
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.dataService = dataService;
                    this.states = commonData_1.CommonData.states;
                    this.countries = commonData_1.CommonData.countries;
                    this.timezones = commonData_1.CommonData.timezones;
                    this.units = commonData_1.CommonData.unitTypes;
                    this.coordinates = commonData_1.CommonData.coordinateTypes;
                    this.dataService.getUser().then(function (user) {
                        _this.user = user;
                    });
                }
                // Constructor
                ProfileViewer.$inject = [
                    '$scope',
                    '$state',
                    'dataService'
                ];
                return ProfileViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.ProfileViewer', [
                userAvatar_1.default.name
            ]).component('dsProfileViewer', {
                bindings: {},
                controller: ProfileViewer,
                templateUrl: './app/components/profileViewer/profileViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=profileViewer.js.map
