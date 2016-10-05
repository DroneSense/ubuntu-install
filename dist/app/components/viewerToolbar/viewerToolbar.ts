
export interface IViewerToolbar extends ng.IScope {
    onSortSelect(value: string): void;
}

class ViewerToolbar {

    searchText: string;
    labels: Array<string>;
    gridVisible: boolean;
    selectedSort: string;
    selectedTags: Array<string> = [];
    filterOptions: string;

    tagSearch: string;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$element'
    ];

    constructor(
        public bindings: IViewerToolbar,
        public element: angular.IRootElementService) {
        
        element.find('input').on('keydown', function(ev: any): void {
          ev.stopPropagation();
        });

        this.filterOptions = 'any';
    }

    clearSearchTerm(): void {
        this.tagSearch = '';
    }

    debug(): void {
        console.log(this.selectedTags);
    }

}

export default angular.module('DroneSense.Web.ViewerToolbar', [

]).component('dsViewerToolbar', {
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
    templateUrl: './app/components/viewerToolbar/ViewerToolbar.html'
});

