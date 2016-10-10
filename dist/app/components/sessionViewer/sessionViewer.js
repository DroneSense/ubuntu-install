System.register(['../../services/redProService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var redProService_1;
    var SessionViewer;
    return {
        setters:[
            function (redProService_1_1) {
                redProService_1 = redProService_1_1;
            }],
        execute: function() {
            SessionViewer = (function () {
                function SessionViewer(bindings, redProService) {
                    this.bindings = bindings;
                    this.redProService = redProService;
                }
                SessionViewer.prototype.$onInit = function () {
                    var _this = this;
                    this.redProService.getLiveStreams().then(function (value) {
                        value.forEach(function (stream) {
                            _this.redProService.getLiveStreamStatistics(stream).then(function () {
                                console.log(stream);
                            });
                        });
                    });
                };
                // Constructor
                SessionViewer.$inject = [
                    '$scope',
                    'redProService'
                ];
                return SessionViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.SessionViewer', [
                redProService_1.default.name
            ]).component('dsSessionViewer', {
                bindings: {},
                controller: SessionViewer,
                templateUrl: './app/components/sessionViewer/sessionViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=sessionViewer.js.map
