var focusOnShow: any = ['$timeout', ($timeout: any): any => {
    return {
        restrict: 'A',
        link: function ($scope: ng.IScope, $element: any, $attr: any): any {
            if ($attr.ngShow) {
                $scope.$watch($attr.ngShow, function (newValue: any): any {
                    if (newValue) {
                        $timeout(function (): any { $element.focus(); }, 0);
                    }
                });
            }
            if ($attr.ngHide) {
                $scope.$watch($attr.ngHide, function (newValue: any): any {
                    if (!newValue) {
                        $timeout(function (): any { $element.focus(); }, 0);
                    }
                });
            }

        }
    };
}];

export default angular.module('DroneSense.Web.FocusOnShow', []).directive('dsFocusOnShow', focusOnShow);
