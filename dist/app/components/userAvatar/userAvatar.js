System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var UserAvatar;
    return {
        setters:[],
        execute: function() {
            UserAvatar = (function () {
                function UserAvatar(bindings) {
                    this.bindings = bindings;
                    this.hasAvatar = false;
                    this.colorOptions = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#ff5722', '#9e9e9e', '#607d8b'];
                    if (this.user && this.user.AvatarUrl && this.user.AvatarUrl !== '') {
                        this.hasAvatar = true;
                    }
                    if (this.size === 46) {
                        this.fontSize = 18;
                    }
                    if (this.size === 30) {
                        this.fontSize = 14;
                    }
                    if (this.size === 100) {
                        this.fontSize = 28;
                    }
                    this.color = this.colorOptions[_.random(0, this.colorOptions.length - 1)];
                }
                // Constructor
                UserAvatar.$inject = [
                    '$scope'
                ];
                return UserAvatar;
            }());
            exports_1("default",angular.module('DroneSense.Web.UserAvatar', []).component('dsUserAvatar', {
                bindings: {
                    user: '<',
                    size: '<'
                },
                controller: UserAvatar,
                templateUrl: './app/components/userAvatar/userAvatar.html'
            }));
        }
    }
});

//# sourceMappingURL=userAvatar.js.map
