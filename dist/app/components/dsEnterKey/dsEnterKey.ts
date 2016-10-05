
class KeyEnterDirective implements angular.IDirective {

    public link: angular.IDirectiveLinkFn;

    restrict: string = 'A';
    scope: boolean = false;

    constructor() {
        this.link = this.unboundLink.bind(this);
    }

    unboundLink(scope: angular.IScope, element: any, attributes: any): any {
        element.bind('keydown keypress', function(event: any): void {
            if (event.which === 13) {
                scope.$apply(function (): void {
                    scope.$eval(attributes.keyEnter);
                });

                event.preventDefault();

                element.blur();
            }
        });
    }

    static instance(): angular.IDirectiveFactory {

        var directive: angular.IDirectiveFactory = () => new KeyEnterDirective();
        directive.$inject = [];
        return directive;
    }

}

export default angular.module('DroneSense.Web.KeyEnter', [
    
]).directive('keyEnter', KeyEnterDirective.instance());
