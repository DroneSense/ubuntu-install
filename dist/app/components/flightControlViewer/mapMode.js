System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MapMode;
    return {
        setters:[],
        execute: function() {
            (function (MapMode) {
                MapMode[MapMode["ThreeDimensional"] = 0] = "ThreeDimensional";
                MapMode[MapMode["TwoDimensional"] = 1] = "TwoDimensional";
            })(MapMode || (MapMode = {}));
            exports_1("MapMode", MapMode);
        }
    }
});

//# sourceMappingURL=mapMode.js.map
