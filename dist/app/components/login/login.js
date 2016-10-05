System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Login;
    return {
        setters:[],
        execute: function() {
            Login = (function () {
                function Login($scope, $state, db) {
                    this.$scope = $scope;
                    this.$state = $state;
                    this.db = db;
                }
                // Create FB email and password account and then sign user in
                Login.prototype.createAccount = function (email, password) {
                    var handle = this.db.session.createUser(email, password);
                    handle.once(handle.EVENTS.USER_CREATED, this.db.$apply(this.$scope, function () {
                        this.$scope.message = 'User " + email + " has been created.';
                        this.onLogin(handle);
                    }), this);
                    handle.once(handle.EVENTS.USER_CREATE_ERRORED, this.db.$apply(this.$scope, function (err) {
                        if (err.code === 'EMAIL_TAKEN') {
                            this.$scope.error = email + ' is not available.';
                        }
                        else if (err.code === 'BAD_EMAIL_PASSWORD') {
                            this.$scope.error = 'Please enter a valid email and/or password';
                        }
                        else {
                            console.log(err.code);
                            this.$scope.error = 'User account could not be created.  Please try again later.';
                        }
                    }), this);
                };
                Login.prototype.login = function (email, password) {
                    this.onLogin(this.db.session.login(this.db.session.LOGIN_TYPES.EMAIL_PASSWORD, email, password));
                };
                Login.prototype.loginFacebook = function () {
                    this.onLogin(this.db.session.login(this.db.session.LOGIN_TYPES.FACEBOOK));
                };
                Login.prototype.loginGoogle = function () {
                    this.onLogin(this.db.session.login(this.db.session.LOGIN_TYPES.GOOGLE));
                };
                Login.prototype.onLogin = function (handle) {
                    handle.once(handle.EVENTS.LOGGED_IN, function () {
                        this.$state.go('flightplan');
                    }, this);
                    handle.once(handle.EVENTS.LOGIN_ERRORED, this.db.$apply(this.$scope, function (err) {
                        if (err.code === 'BAD_EMAIL_PASSWORD') {
                            this.$scope.error = 'Please enter a valid email and/or password';
                        }
                        else {
                            console.log(err.code);
                            this.$scope.error = 'An error occurred during login. Please try again later.';
                        }
                    }), this);
                };
                Login.$inject = [
                    '$scope', '$state', 'db'
                ];
                return Login;
            }());
            exports_1("default",angular.module('DroneSense.Web.Login', []).component('dsLogin', {
                controller: Login,
                templateUrl: './app/components/login/login.html'
            }));
        }
    }
});

//# sourceMappingURL=login.js.map
