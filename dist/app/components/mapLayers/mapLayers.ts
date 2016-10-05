import { SessionController } from '../flightControlViewer/sessionController';

export interface IMapLayers extends ng.IScope {

}

class MapLayers {

    // Map Layers Variables
    showMapLayers: boolean = false;

    mapsActive: boolean = true;

    layersActive: boolean = false;

    sessionController: SessionController;

    buildings: any;

    // Constructor
    static $inject: Array<string> = [
        '$scope'
    ];
    constructor(public bindings: IMapLayers) {

    }

    showBuildings(): void {

        if (this.buildings && this.sessionController.map.scene.primitives.contains(this.buildings)) {
            this.sessionController.map.scene.primitives.remove(this.buildings);
        } else {
            this.buildings = this.sessionController.map.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: 'https://www.cesiumcontent.com/api/assets/3/data/tileset.json?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZjgxNGRiYS0wMjc0LTQ2ZWMtYTJhNC1kMzRhYzkyNDE0YjgiLCJpZCI6NSwiYXNzZXRzIjpbM10sImlhdCI6MTQ1NzQ1ODEwOX0.-kwaVNM63oY4-rqLiZHqSedHRImPCZtkizCU50SuKwA'
            }));

            // var greenCylinder: any = this.map.entities.add({
            //     name : 'KAUS Airspace',
            //     position: Cesium.Cartesian3.fromDegrees(-97.6663058, 30.1974292, 150.0),
            //     cylinder : {
            //         length : 1280.0,
            //         topRadius : 9260.0,
            //         bottomRadius : 9260.0,
            //         material : Cesium.Color.MAGENTA.withAlpha(0.3),
            //         outline : true,
            //         outlineColor: Cesium.Color.WHITE
            //     }
            // });
        }
    }

}

export default angular.module('DroneSense.Web.MapLayers', [

]).component('dsMapLayers', {
    bindings: {
        sessionController: '<'
    },
    controller: MapLayers,
    templateUrl: './app/components/mapLayers/mapLayers.html'
});
