System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MapControls;
    return {
        setters:[],
        execute: function() {
            MapControls = (function () {
                function MapControls(bindings) {
                    this.mapLayersVisible = false;
                    this.overlaysVisible = false;
                }
                // Handle callback from control component
                MapControls.prototype.zoomIn = function () {
                    // Use navigation plugin's zoom method
                    // Note: the actual control is hidden and using our own buttons
                    this.map.navigation.navigationViewModel.controls[0].zoomIn();
                    //console.log(this.map.imageryLayers);
                };
                // Handle callback from control component
                MapControls.prototype.resetView = function () {
                    // Use navigation plugin's reset home method
                    // Note: the actual control is hidden and using our own buttons
                    this.map.navigation.navigationViewModel.controls[1].resetView();
                };
                // Handle callback from control component
                MapControls.prototype.zoomOut = function () {
                    // Use navigation plugin's zoom method
                    // Note: the actual control is hidden and using our own buttons
                    this.map.navigation.navigationViewModel.controls[2].zoomOut();
                };
                // Constructor
                MapControls.$inject = [
                    '$scope'
                ];
                return MapControls;
            }());
            exports_1("default",angular.module('DroneSense.Web.MapControls', []).component('dsMapControls', {
                bindings: {
                    map: '<'
                },
                controller: MapControls,
                templateUrl: './app/components/mapControls/mapControls.html'
            }));
        }
    }
});

//# sourceMappingURL=mapControls.js.map
