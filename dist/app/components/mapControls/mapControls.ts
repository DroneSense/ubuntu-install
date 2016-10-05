
export interface IMapControls extends ng.IScope {
    map: Cesium.Viewer;
}

class MapControls {

    mapLayersVisible: boolean = false;
    overlaysVisible: boolean = false;

    // Map reference passed in from bindings
    map: Cesium.Viewer;

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];

    constructor(bindings: IMapControls) {

    }

    // Handle callback from control component
    zoomIn(): void {
        // Use navigation plugin's zoom method
        // Note: the actual control is hidden and using our own buttons
        this.map.navigation.navigationViewModel.controls[0].zoomIn();

        //console.log(this.map.imageryLayers);

    }

    // Handle callback from control component
    resetView(): void {
        // Use navigation plugin's reset home method
        // Note: the actual control is hidden and using our own buttons
        this.map.navigation.navigationViewModel.controls[1].resetView();
    }

    // Handle callback from control component
    zoomOut(): void {
        // Use navigation plugin's zoom method
        // Note: the actual control is hidden and using our own buttons
        this.map.navigation.navigationViewModel.controls[2].zoomOut();
    }

}

export default angular.module('DroneSense.Web.MapControls', [
    
]).component('dsMapControls', {
    bindings: {
        map: '<'
    },
    controller: MapControls,
    templateUrl: './app/components/mapControls/mapControls.html'
});
