System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Polygon3DTool;
    return {
        setters:[],
        execute: function() {
            Polygon3DTool = (function () {
                function Polygon3DTool(map, callback) {
                    this.map = map;
                    this.callback = callback;
                    this.IconPath = './app/components/tools/polygon3DTool/images/polyObject.svg';
                    this.ToolTip = 'Create polygon object';
                }
                Polygon3DTool.prototype.StartEdit = function () {
                };
                Polygon3DTool.prototype.StopEdit = function () {
                    this.Selected = false;
                };
                return Polygon3DTool;
            }());
            exports_1("Polygon3DTool", Polygon3DTool);
        }
    }
});

//# sourceMappingURL=polygon3DDrawTool.js.map
