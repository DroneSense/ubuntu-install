
export interface IDocumentViewer extends ng.IScope {
}

class DocumentViewer {

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$state'
    ];

    constructor(
        public bindings: IDocumentViewer,
        public stateService: angular.ui.IStateService) {
            
    }

}

export default angular.module('DroneSense.Web.DocumentViewer', [

]).component('dsDocumentViewer', {
    bindings: {
    },
    controller: DocumentViewer,
    templateUrl: './app/components/documentViewer/documentViewer.html'
});
