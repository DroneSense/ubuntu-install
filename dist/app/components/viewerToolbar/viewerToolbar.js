System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ViewerToolbar;
    return {
        setters:[],
        execute: function() {
            ViewerToolbar = (function () {
                function ViewerToolbar(bindings, element) {
                    this.bindings = bindings;
                    this.element = element;
                    this.selectedTags = [];
                    element.find('input').on('keydown', function (ev) {
                        ev.stopPropagation();
                    });
                    this.filterOptions = 'any';
                }
                ViewerToolbar.prototype.clearSearchTerm = function () {
                    this.tagSearch = '';
                };
                ViewerToolbar.prototype.debug = function () {
                    console.log(this.selectedTags);
                };
                // Constructor
                ViewerToolbar.$inject = [
                    '$scope',
                    '$element'
                ];
                return ViewerToolbar;
            }());
            exports_1("default",angular.module('DroneSense.Web.ViewerToolbar', []).component('dsViewerToolbar', {
                bindings: {
                    labels: '<',
                    sortOptions: '<',
                    onSortSelect: '&',
                    onSearch: '&',
                    gridVisible: '<',
                    onShowGrid: '&',
                    onShowList: '&',
                    onAddClicked: '&',
                    tagsChanged: '&',
                    filterTags: '<'
                },
                controller: ViewerToolbar,
                templateUrl: './app/components/viewerToolbar/viewerToolbar.html'
            }));
        }
    }
});

//# sourceMappingURL=viewerToolbar.js.map
