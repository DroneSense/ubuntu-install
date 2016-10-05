System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MapService;
    return {
        setters:[],
        execute: function() {
            MapService = (function () {
                function MapService($q) {
                    this.$q = $q;
                    this.terrainProvider = new Cesium.CesiumTerrainProvider({
                        //url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
                        url: '//assets.agi.com/stk-terrain/world'
                    });
                }
                MapService.prototype.getElevation = function (lat, lng) {
                    var deferred = this.$q.defer();
                    // Create positions object for terrain query
                    var positions = [
                        Cesium.Cartographic.fromDegrees(lng, lat)
                    ];
                    Cesium.sampleTerrain(this.terrainProvider, 15, positions).then(function (updatedPositions) {
                        deferred.resolve(updatedPositions[0].height);
                    });
                    return deferred.promise;
                };
                MapService.$inject = ['$q'];
                return MapService;
            }());
            exports_1("default",angular.module('DroneSense.Web.MapService', []).service('mapService', MapService));
        }
    }
});

//# sourceMappingURL=mapService.js.map
