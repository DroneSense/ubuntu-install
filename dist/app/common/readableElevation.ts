import { Conversions } from '@dronesense/model/lib/common/Utility';
import { IDSRootScope } from '../services/userService';

var readableElevation: any = ['$rootScope', ($rootScope: IDSRootScope): any => {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope: ng.IScope, element: any, attr: any, ngModel: any): any {

            scope.$watch(() => { return $rootScope.isMetric; }, (newValue: any, oldValue: any) => {

                if ($rootScope.isMetric || $rootScope.isMetric === undefined) {
                    ngModel.$setViewValue(ngModel.$modelValue.toFixed(2));
                } else {
                    ngModel.$setViewValue(Conversions.metersToFeet(ngModel.$modelValue));
                }

                ngModel.$render();

            });

            // What to show
            ngModel.$formatters.push((value: number): any => {
                if ($rootScope.isMetric || $rootScope.isMetric === undefined) {
                    return parseFloat(value.toFixed(2));
                } else {
                    return Conversions.metersToFeet(value);
                }
            });

            // What to give to the model
            ngModel.$parsers.push((value: number): any => {
                if (!$rootScope.isMetric || $rootScope.isMetric === undefined) {
                    return Conversions.feetToMeters(value);
                } else {
                    return value;
                }
            });

        }
    };
}];

export default angular.module('DroneSense.Web.ReadableElevation', []).directive('readableElevation', readableElevation);
