System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Circle3DTool;
    return {
        setters:[],
        execute: function() {
            Circle3DTool = (function () {
                function Circle3DTool(map, callback) {
                    this.map = map;
                    this.callback = callback;
                    this.IconPath = './app/components/tools/Circle3DTool/images/cylinderObject.svg';
                    this.ToolTip = 'Create cylinder object';
                }
                Circle3DTool.prototype.StartEdit = function () {
                };
                Circle3DTool.prototype.StopEdit = function () {
                    this.Selected = false;
                };
                return Circle3DTool;
            }());
            exports_1("Circle3DTool", Circle3DTool);
        }
    }
});

//# sourceMappingURL=circle3DDrawTool.js.map
