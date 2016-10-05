System.register(['../dashboardViewer/dashboardViewer', '../../common/ngLazyShow'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var dashboardViewer_1, ngLazyShow_1;
    var ManageViewer;
    return {
        setters:[
            function (dashboardViewer_1_1) {
                dashboardViewer_1 = dashboardViewer_1_1;
            },
            function (ngLazyShow_1_1) {
                ngLazyShow_1 = ngLazyShow_1_1;
            }],
        execute: function() {
            ManageViewer = (function () {
                function ManageViewer(bindings, stateService, dataService) {
                    var _this = this;
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.dataService = dataService;
                    this.setActiveTab();
                    dataService.getUser().then(function (user) {
                        _this.user = user;
                        dataService.getCurrentAccount().then(function (account) {
                            _this.currentAccount = account;
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                    // this.user.ModelUpdated.on((): void => {
                    //     this.bindings.$applyAsync();
                    // });
                }
                // Set the active tab based on URL
                ManageViewer.prototype.setActiveTab = function () {
                    if (this.stateService.current.name === 'manage.flightplans') {
                        this.selectedTab = 1;
                    }
                    else if (this.stateService.current.name === 'manage.hardware') {
                        this.selectedTab = 2;
                    }
                    else if (this.stateService.current.name === 'manage.profile') {
                        this.selectedTab = -1;
                    }
                    else if (this.stateService.current.name === 'manage.account') {
                        this.selectedTab = -1;
                    }
                };
                // Transition to new state defined in the app.ts file.
                ManageViewer.prototype.goTo = function (state) {
                    this.stateService.go(state);
                };
                ManageViewer.prototype.loadProfile = function () {
                    console.log('load profile');
                };
                ManageViewer.prototype.signOut = function () {
                    this.dataService.logout();
                    this.dataService.login();
                };
                // Constructor
                ManageViewer.$inject = [
                    '$scope',
                    '$state',
                    'dataService'
                ];
                return ManageViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.ManageViewer', [
                dashboardViewer_1.default.name,
                ngLazyShow_1.default.name
            ]).component('dsManage', {
                bindings: {},
                controller: ManageViewer,
                templateUrl: './app/components/manageViewer/manageViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=manageViewer.js.map
