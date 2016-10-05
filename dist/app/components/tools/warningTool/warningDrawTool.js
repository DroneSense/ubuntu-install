System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var WarningTool;
    return {
        setters:[],
        execute: function() {
            WarningTool = (function () {
                function WarningTool(map, callback) {
                    this.map = map;
                    this.callback = callback;
                    this.IconPath = './app/components/tools/warningTool/images/warning.svg';
                    this.ToolTip = 'Add Warning Note';
                }
                WarningTool.prototype.StartEdit = function () {
                };
                WarningTool.prototype.StopEdit = function () {
                    this.Selected = false;
                };
                return WarningTool;
            }());
            exports_1("WarningTool", WarningTool);
        }
    }
});

//# sourceMappingURL=warningDrawTool.js.map
