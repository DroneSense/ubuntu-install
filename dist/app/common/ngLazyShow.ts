var ngLazyShowDirective: any = ['$animate', function ($animate: any): any {

    return {
        multiElement: true,
        transclude: 'element',
        priority: 600,
        terminal: true,
        restrict: 'A',
        link: function ($scope: ng.IScope, $element: ng.IRootElementService, $attr: any, $ctrl: ng.IControllerProvider, $transclude: ng.ITranscludeFunction): any {
            var loaded: boolean;
            $scope.$watch($attr.ngLazyShow, function ngLazyShowWatchAction(value: any): void {
                if (loaded) {
                    $animate[value ? 'removeClass' : 'addClass']($element, 'ng-hide');
                } else if (value) {
                    loaded = true;
                    $transclude(function (clone: any): void {
                        clone[clone.length++] = document.createComment(' end ngLazyShow: ' + $attr.ngLazyShow + ' ');
                        $animate.enter(clone, $element.parent(), $element);
                        $element = clone;
                    });
                }
            });
        }
    };

}];

export default angular.module('DroneSense.Web.LazyShow', []).directive('ngLazyShow', ngLazyShowDirective);
