System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MeasureTool;
    return {
        setters:[],
        execute: function() {
            MeasureTool = (function () {
                function MeasureTool(map, callback) {
                    this.map = map;
                    this.callback = callback;
                    this.IconPath = './app/components/tools/measureTool/images/measure.svg';
                    this.ToolTip = 'Measure Distance';
                }
                MeasureTool.prototype.StartEdit = function () {
                };
                MeasureTool.prototype.StopEdit = function () {
                    this.Selected = false;
                };
                return MeasureTool;
            }());
            exports_1("MeasureTool", MeasureTool);
        }
    }
});

//# sourceMappingURL=measureDrawTool.js.map
