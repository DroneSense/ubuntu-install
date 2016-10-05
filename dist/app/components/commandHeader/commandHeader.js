System.register(['../../common/focusOnShow', '../dsEnterKey/dsEnterKey'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var focusOnShow_1, dsEnterKey_1;
    var CommandHeader;
    return {
        setters:[
            function (focusOnShow_1_1) {
                focusOnShow_1 = focusOnShow_1_1;
            },
            function (dsEnterKey_1_1) {
                dsEnterKey_1 = dsEnterKey_1_1;
            }],
        execute: function() {
            CommandHeader = (function () {
                function CommandHeader(bindings) {
                    this.bindings = bindings;
                }
                CommandHeader.$inject = [
                    '$scope'
                ];
                return CommandHeader;
            }());
            exports_1("default",angular.module('DroneSense.Web.CommandHeader', [
                focusOnShow_1.default.name,
                dsEnterKey_1.default.name
            ]).component('dsCommandHeader', {
                bindings: {
                    command: '<',
                    onFlyTo: '&'
                },
                controller: CommandHeader,
                templateUrl: './app/components/commandHeader/commandHeader.html'
            }));
        }
    }
});

//# sourceMappingURL=commandHeader.js.map
