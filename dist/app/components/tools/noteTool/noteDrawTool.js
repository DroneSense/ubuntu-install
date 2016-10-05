System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var NoteTool;
    return {
        setters:[],
        execute: function() {
            NoteTool = (function () {
                function NoteTool(map, callback) {
                    this.map = map;
                    this.callback = callback;
                    this.IconPath = './app/components/tools/noteTool/images/note.svg';
                    this.ToolTip = 'Add note';
                }
                NoteTool.prototype.StartEdit = function () {
                };
                NoteTool.prototype.StopEdit = function () {
                    this.Selected = false;
                };
                return NoteTool;
            }());
            exports_1("NoteTool", NoteTool);
        }
    }
});

//# sourceMappingURL=noteDrawTool.js.map
