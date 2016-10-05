System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var OrbitTool;
    return {
        setters:[],
        execute: function() {
            OrbitTool = (function () {
                function OrbitTool(map, callback) {
                    this.map = map;
                    this.callback = callback;
                    this.IconPath = './app/components/tools/orbitTool/images/orbit.svg';
                    this.ToolTip = 'Add Orbit Point';
                }
                OrbitTool.prototype.StartEdit = function () {
                };
                OrbitTool.prototype.StopEdit = function () {
                    this.Selected = false;
                };
                return OrbitTool;
            }());
            exports_1("OrbitTool", OrbitTool);
        }
    }
});

//# sourceMappingURL=orbitDrawTool.js.map
