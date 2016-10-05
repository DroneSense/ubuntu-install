System.register(['@dronesense/model', '../../services/commonData'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var model_1, commonData_1;
    var AccountViewer;
    return {
        setters:[
            function (model_1_1) {
                model_1 = model_1_1;
            },
            function (commonData_1_1) {
                commonData_1 = commonData_1_1;
            }],
        execute: function() {
            AccountViewer = (function () {
                function AccountViewer(bindings, stateService, dataService) {
                    var _this = this;
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.dataService = dataService;
                    this.useMailForBill = false;
                    this.countries = commonData_1.CommonData.countries;
                    this.states = commonData_1.CommonData.states;
                    dataService.getCurrentAccount().then(function (account) {
                        _this.account = account;
                    });
                }
                AccountViewer.prototype.setOrClearMailToBill = function () {
                    if (this.useMailForBill) {
                        this.account.BillAddress = this.account.MailAddress;
                    }
                    else {
                        this.account.BillAddress = new model_1.Address();
                    }
                };
                AccountViewer.prototype.test = function (value) {
                    console.log(value);
                };
                // Constructor
                AccountViewer.$inject = [
                    '$scope',
                    '$state',
                    'dataService'
                ];
                return AccountViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.AccountViewer', []).component('dsAccountViewer', {
                bindings: {},
                controller: AccountViewer,
                templateUrl: './app/components/accountViewer/accountViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=accountViewer.js.map
