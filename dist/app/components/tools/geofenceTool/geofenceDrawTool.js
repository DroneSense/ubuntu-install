System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GeofenceTool;
    return {
        setters:[],
        execute: function() {
            GeofenceTool = (function () {
                function GeofenceTool(map, callback) {
                    this.map = map;
                    this.callback = callback;
                    this.IconPath = './app/components/tools/geofenceTool/images/geofence.svg';
                    this.ToolTip = 'Add Geofence';
                }
                GeofenceTool.prototype.StartEdit = function () {
                };
                GeofenceTool.prototype.StopEdit = function () {
                    this.Selected = false;
                };
                return GeofenceTool;
            }());
            exports_1("GeofenceTool", GeofenceTool);
        }
    }
});

//# sourceMappingURL=geofenceDrawTool.js.map
