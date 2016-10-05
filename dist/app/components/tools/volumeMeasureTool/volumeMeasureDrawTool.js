System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var VolumeMeasureTool;
    return {
        setters:[],
        execute: function() {
            VolumeMeasureTool = (function () {
                function VolumeMeasureTool(map, callback) {
                    this.map = map;
                    this.callback = callback;
                    this.IconPath = './app/components/tools/volumeMeasureTool/images/volume.svg';
                    this.ToolTip = 'Calculate Volume';
                }
                VolumeMeasureTool.prototype.StartEdit = function () {
                };
                VolumeMeasureTool.prototype.StopEdit = function () {
                    this.Selected = false;
                };
                return VolumeMeasureTool;
            }());
            exports_1("VolumeMeasureTool", VolumeMeasureTool);
        }
    }
});

//# sourceMappingURL=volumeMeasureDrawTool.js.map
