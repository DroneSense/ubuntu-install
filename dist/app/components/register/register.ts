
class Test {

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];

    // Take a list of tools and load
    constructor(public bindings: any) {
    }

}

export default angular.module('DroneSense.Web.Test', [
    
]).component('dsTest', {
    bindings: {
    },
    controller: Test,
    templateUrl: './app/components/test/test.html'
});
