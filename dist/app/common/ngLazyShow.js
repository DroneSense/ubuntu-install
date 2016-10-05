System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ngLazyShowDirective;
    return {
        setters:[],
        execute: function() {
            ngLazyShowDirective = ['$animate', function ($animate) {
                    return {
                        multiElement: true,
                        transclude: 'element',
                        priority: 600,
                        terminal: true,
                        restrict: 'A',
                        link: function ($scope, $element, $attr, $ctrl, $transclude) {
                            var loaded;
                            $scope.$watch($attr.ngLazyShow, function ngLazyShowWatchAction(value) {
                                if (loaded) {
                                    $animate[value ? 'removeClass' : 'addClass']($element, 'ng-hide');
                                }
                                else if (value) {
                                    loaded = true;
                                    $transclude(function (clone) {
                                        clone[clone.length++] = document.createComment(' end ngLazyShow: ' + $attr.ngLazyShow + ' ');
                                        $animate.enter(clone, $element.parent(), $element);
                                        $element = clone;
                                    });
                                }
                            });
                        }
                    };
                }];
            exports_1("default",angular.module('DroneSense.Web.LazyShow', []).directive('ngLazyShow', ngLazyShowDirective));
        }
    }
});

//# sourceMappingURL=ngLazyShow.js.map
