System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ElevationTool;
    return {
        setters:[],
        execute: function() {
            ElevationTool = (function () {
                function ElevationTool(map, callback) {
                    this.map = map;
                    this.callback = callback;
                    this.IconPath = './app/components/tools/elevationTool/images/elevation.svg';
                    this.ToolTip = 'Sample elevation';
                }
                ElevationTool.prototype.StartEdit = function () {
                };
                ElevationTool.prototype.StopEdit = function () {
                    this.Selected = false;
                };
                return ElevationTool;
            }());
            exports_1("ElevationTool", ElevationTool);
        }
    }
});

//# sourceMappingURL=elevationDrawTool.js.map
