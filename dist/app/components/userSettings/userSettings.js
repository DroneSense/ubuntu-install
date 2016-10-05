System.register(['../../services/userService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var userService_1;
    var UserSettings;
    return {
        setters:[
            function (userService_1_1) {
                userService_1 = userService_1_1;
            }],
        execute: function() {
            UserSettings = (function () {
                function UserSettings(bindings, db, userService) {
                    this.bindings = bindings;
                    this.db = db;
                    this.userService = userService;
                    this.units = ['Standard', 'Metric'];
                    this.timezones = [
                        'Alpha Time Zone UTC +1:00',
                        'Australian Central Daylight Time UTC +10:30',
                        'Australian Central Standard Time UTC +9:30',
                        'Pacific Time',
                        'Mountain Time',
                        'Central Time',
                        'Eastern Time'
                    ];
                }
                // Methods
                UserSettings.prototype.changePassword = function () {
                    this.db.session.changePassword(this.user.Email, this.CurrentPassword, this.NewPassword)
                        .then(this.db.$apply(this.bindings, function () {
                        this.passwordSuccess = 'Password updated';
                        this.NewPassword = '';
                        this.CurrentPassword = '';
                        this.$timeout((function () {
                            this.passwordSuccess = null;
                        }).bind(this), 2000);
                    }, this))
                        .catch(this.db.$apply(this.bindings, function (err) {
                        this.passwordError = err.message;
                    }, this));
                };
                UserSettings.prototype.logout = function () {
                    this.userService.Logout();
                };
                UserSettings.prototype.updateProperty = function (model, prop, propName) {
                    //model.SaveProperty(prop, propName);
                };
                UserSettings.prototype.SetUnitPref = function (value) {
                    //this.userService.CurrentUser.SaveProperty(this.user.UnitPreference, 'UnitPreference');
                };
                UserSettings.prototype.SetTimeZone = function () {
                    //this.userService.CurrentUser.SaveProperty(this.user.TimeZone, 'TimeZone');
                };
                // Constructor
                UserSettings.$inject = [
                    '$scope',
                    'db',
                    'userService'
                ];
                return UserSettings;
            }());
            exports_1("default",angular.module('DroneSense.Web.UserSettings', [
                userService_1.default.name
            ]).component('dsUserSettings', {
                bindings: {
                    user: '<'
                },
                controller: UserSettings,
                templateUrl: './app/components/userSettings/userSettings.html'
            }));
        }
    }
});

//# sourceMappingURL=userSettings.js.map
