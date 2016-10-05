System.register(['@dronesense/model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var model_1;
    var UserService;
    return {
        setters:[
            function (model_1_1) {
                model_1 = model_1_1;
            }],
        execute: function() {
            UserService = (function () {
                function UserService(db, $rootScope, $state) {
                    var _this = this;
                    this.db = db;
                    this.$state = $state;
                    this.CurrentUser = new model_1.User(db.session.handle.userHandle);
                    this.CurrentUser.on('propertyChanged', function (name, value) {
                        if (_this.CurrentUser && _this.CurrentUser.UnitPreference && _this.CurrentUser.UnitPreference.toLowerCase() === 'metric') {
                            $rootScope.isMetric = true;
                        }
                        else {
                            $rootScope.isMetric = false;
                        }
                        // emit broadcast to all rootScope.on
                        $rootScope.$emit('unitPrefChanged', $rootScope.isMetric);
                        $rootScope.$applyAsync();
                    });
                }
                UserService.prototype.Logout = function () {
                    this.db.session.logout();
                    this.$state.go('login');
                };
                UserService.$inject = ['db', '$rootScope', '$state'];
                return UserService;
            }());
            exports_1("default",angular.module('DroneSense.Web.UserService', []).service('userService', UserService));
        }
    }
});

//# sourceMappingURL=userService.js.map
