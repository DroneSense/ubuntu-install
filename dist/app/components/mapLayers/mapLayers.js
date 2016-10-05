System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MapLayers;
    return {
        setters:[],
        execute: function() {
            MapLayers = (function () {
                function MapLayers(bindings) {
                    this.bindings = bindings;
                    // Map Layers Variables
                    this.showMapLayers = false;
                    this.mapsActive = true;
                    this.layersActive = false;
                }
                MapLayers.prototype.showBuildings = function () {
                    if (this.buildings && this.sessionController.map.scene.primitives.contains(this.buildings)) {
                        this.sessionController.map.scene.primitives.remove(this.buildings);
                    }
                    else {
                        this.buildings = this.sessionController.map.scene.primitives.add(new Cesium.Cesium3DTileset({
                            url: 'https://www.cesiumcontent.com/api/assets/3/data/tileset.json?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZjgxNGRiYS0wMjc0LTQ2ZWMtYTJhNC1kMzRhYzkyNDE0YjgiLCJpZCI6NSwiYXNzZXRzIjpbM10sImlhdCI6MTQ1NzQ1ODEwOX0.-kwaVNM63oY4-rqLiZHqSedHRImPCZtkizCU50SuKwA'
                        }));
                    }
                };
                // Constructor
                MapLayers.$inject = [
                    '$scope'
                ];
                return MapLayers;
            }());
            exports_1("default",angular.module('DroneSense.Web.MapLayers', []).component('dsMapLayers', {
                bindings: {
                    sessionController: '<'
                },
                controller: MapLayers,
                templateUrl: './app/components/mapLayers/mapLayers.html'
            }));
        }
    }
});

//# sourceMappingURL=mapLayers.js.map
