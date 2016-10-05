System.register(['../userSettings/userSettings', '../dsEnterKey/dsEnterKey'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var userSettings_1, dsEnterKey_1;
    var AppBar;
    return {
        setters:[
            function (userSettings_1_1) {
                userSettings_1 = userSettings_1_1;
            },
            function (dsEnterKey_1_1) {
                dsEnterKey_1 = dsEnterKey_1_1;
            }],
        execute: function() {
            AppBar = (function () {
                function AppBar(bindings) {
                    // Class properties
                    this.flightPlanNameFocus = false;
                }
                // Constructor
                AppBar.$inject = [
                    '$scope'
                ];
                return AppBar;
            }());
            exports_1("default",angular.module('DroneSense.Web.AppBar', [
                userSettings_1.default.name,
                dsEnterKey_1.default.name
            ]).component('dsAppBar', {
                bindings: {
                    onExit: '&',
                    mode: '@',
                    onSaveFlightPlan: '&',
                    flightPlanName: '@',
                    flightPlanSaved: '<',
                    userInitials: '@',
                    userName: '@',
                    userSettingsVisible: '<',
                    onShowUserSettings: '&',
                    user: '<'
                },
                controller: AppBar,
                templateUrl: './app/components/appbar/appbar.html'
            }));
        }
    }
});

//# sourceMappingURL=appBar.js.map
