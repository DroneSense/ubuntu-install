
export interface IMapService {
    getElevation(lat: number, lng: number): ng.IPromise<number>;
}

class MapService {
    
    static $inject: Array<string> = ['$q'];
    
    constructor(public $q: ng.IQService) {

    }
    
    terrainProvider: Cesium.CesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
            //url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
            url: '//assets.agi.com/stk-terrain/world'
    });
    
    getElevation(lat: number, lng: number): ng.IPromise<number> {
        
        var deferred: ng.IDeferred<number> = this.$q.defer<number>();
        
        // Create positions object for terrain query
        var positions: Array<Cesium.Cartographic> = [
            Cesium.Cartographic.fromDegrees(lng, lat)
        ];
        
        Cesium.sampleTerrain(this.terrainProvider, 15, positions).then((updatedPositions: any): void => {
            deferred.resolve(updatedPositions[0].height);
        });
        
        return deferred.promise;
    }
    
}

export default angular.module('DroneSense.Web.MapService', [
    
]).service('mapService', MapService);
