System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CesiumMapUtils;
    return {
        setters:[],
        execute: function() {
            CesiumMapUtils = (function () {
                function CesiumMapUtils() {
                }
                CesiumMapUtils.getCameraFocus = function (map, inWorldCoordinates) {
                    var unprojectedScratch = new Cesium.Cartographic();
                    var rayScratch = new Cesium.Ray();
                    var scene = map.scene;
                    var camera = scene.camera;
                    if (scene.mode === Cesium.SceneMode.MORPHING) {
                        return undefined;
                    }
                    var result = new Cesium.Cartesian3();
                    // TODO bug when tracking: if entity moves the current position should be used and not only the one when starting orbiting/rotating
                    // TODO bug when tracking: reset should reset to default view of tracked entity
                    if (map.trackedEntity) {
                        result = map.trackedEntity.position.getValue(map.clock.currentTime);
                    }
                    else {
                        rayScratch.origin = camera.positionWC;
                        rayScratch.direction = camera.directionWC;
                        result = scene.globe.pick(rayScratch, scene, result);
                    }
                    if (!result) {
                        return undefined;
                    }
                    if (scene.mode === Cesium.SceneMode.SCENE2D || scene.mode === Cesium.SceneMode.COLUMBUS_VIEW) {
                        result = camera.worldToCameraCoordinatesPoint(result, result);
                        if (inWorldCoordinates) {
                            result = scene.globe.ellipsoid.cartographicToCartesian(scene.mapProjection.unproject(result, unprojectedScratch), result);
                        }
                    }
                    else {
                        if (!inWorldCoordinates) {
                            result = camera.worldToCameraCoordinatesPoint(result, result);
                        }
                    }
                    return result;
                };
                CesiumMapUtils.zoom = function (map, zoomIn) {
                    var relativeAmount = 1.2;
                    var cartesian3Scratch = new Cesium.Cartesian3();
                    if (zoomIn) {
                        // this ensures that zooming in is the inverse of zooming out and vice versa
                        // e.g. the camera position remains when zooming in and out
                        relativeAmount = 1 / relativeAmount;
                    }
                    if (map) {
                        var scene = map.scene;
                        var camera = scene.camera;
                        var orientation_1;
                        switch (scene.mode) {
                            case Cesium.SceneMode.MORPHING:
                                break;
                            case Cesium.SceneMode.SCENE2D:
                                camera.zoomIn(camera.positionCartographic.height * (1 - relativeAmount));
                                break;
                            default:
                                var focus_1;
                                if (map.trackedEntity) {
                                    focus_1 = new Cesium.Cartesian3();
                                }
                                else {
                                    focus_1 = CesiumMapUtils.getCameraFocus(map, false);
                                }
                                if (focus_1) {
                                    // Camera direction is not pointing at the globe, so use the ellipsoid horizon point as
                                    // the focal point.
                                    var ray = new Cesium.Ray(camera.worldToCameraCoordinatesPoint(scene.globe.ellipsoid.cartographicToCartesian(camera.positionCartographic)), camera.directionWC);
                                    focus_1 = Cesium.IntersectionTests.grazingAltitudeLocation(ray, scene.globe.ellipsoid);
                                    orientation_1 = {
                                        heading: camera.heading,
                                        pitch: camera.pitch,
                                        roll: camera.roll
                                    };
                                }
                                else {
                                    orientation_1 = {
                                        direction: camera.direction,
                                        up: camera.up
                                    };
                                }
                                var direction = Cesium.Cartesian3.subtract(camera.position, focus_1, cartesian3Scratch);
                                var movementVector = Cesium.Cartesian3.multiplyByScalar(direction, relativeAmount, direction);
                                var endPosition = Cesium.Cartesian3.add(focus_1, movementVector, focus_1);
                                if (map.trackedEntity || scene.mode === Cesium.SceneMode.COLUMBUS_VIEW) {
                                    // sometimes flyTo does not work (jumps to wrong position) so just set the position without any animation
                                    // do not use flyTo when tracking an entity because during animatiuon the position of the entity may change
                                    camera.position = endPosition;
                                }
                                else {
                                    camera.flyTo({
                                        destination: endPosition,
                                        orientation: orientation_1,
                                        duration: 0.5,
                                        convert: false
                                    });
                                }
                        }
                    }
                };
                return CesiumMapUtils;
            }());
            exports_1("CesiumMapUtils", CesiumMapUtils);
        }
    }
});

//# sourceMappingURL=mapUtils.js.map
