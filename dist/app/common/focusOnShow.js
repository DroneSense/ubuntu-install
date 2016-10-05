System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var focusOnShow;
    return {
        setters:[],
        execute: function() {
            focusOnShow = ['$timeout', function ($timeout) {
                    return {
                        restrict: 'A',
                        link: function ($scope, $element, $attr) {
                            if ($attr.ngShow) {
                                $scope.$watch($attr.ngShow, function (newValue) {
                                    if (newValue) {
                                        $timeout(function () { $element.focus(); }, 0);
                                    }
                                });
                            }
                            if ($attr.ngHide) {
                                $scope.$watch($attr.ngHide, function (newValue) {
                                    if (!newValue) {
                                        $timeout(function () { $element.focus(); }, 0);
                                    }
                                });
                            }
                        }
                    };
                }];
            exports_1("default",angular.module('DroneSense.Web.FocusOnShow', []).directive('dsFocusOnShow', focusOnShow));
        }
    }
});

//# sourceMappingURL=focusOnShow.js.map
