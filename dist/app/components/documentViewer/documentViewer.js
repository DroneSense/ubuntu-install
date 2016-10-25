System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DocumentViewer;
    return {
        setters:[],
        execute: function() {
            DocumentViewer = (function () {
                function DocumentViewer(bindings, stateService) {
                    this.bindings = bindings;
                    this.stateService = stateService;
                }
                // Constructor
                DocumentViewer.$inject = [
                    '$scope',
                    '$state'
                ];
                return DocumentViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.DocumentViewer', []).component('dsDocumentViewer', {
                bindings: {},
                controller: DocumentViewer,
                templateUrl: './app/components/documentViewer/documentViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=documentViewer.js.map
