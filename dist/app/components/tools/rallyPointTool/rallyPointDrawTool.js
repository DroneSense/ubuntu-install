System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var RallyPointTool;
    return {
        setters:[],
        execute: function() {
            RallyPointTool = (function () {
                function RallyPointTool(map, callback) {
                    this.map = map;
                    this.callback = callback;
                    this.IconPath = './app/components/tools/rallyPointTool/images/rallypoint.svg';
                    this.ToolTip = 'Add Rallypoints';
                }
                RallyPointTool.prototype.StartEdit = function () {
                };
                RallyPointTool.prototype.StopEdit = function () {
                    this.Selected = false;
                };
                return RallyPointTool;
            }());
            exports_1("RallyPointTool", RallyPointTool);
        }
    }
});

//# sourceMappingURL=rallyPointDrawTool.js.map
