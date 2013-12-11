/**
 * @copyright © 2013 Environmental Systems Research Institute, Inc. (Esri)
 *
 * @license
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at<br>
 * <br>
 *     {@link http://www.apache.org/licenses/LICENSE-2.0}<br>
 * <br>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
define(["cmwapi/cmwapi", "esri/kernel", "esri/geometry/Extent"], function(CommonMapApi, EsriNS, Extent) {
    var Status = function(adapater, map) {
        var me = this;

        /**
         * Handler for an incoming map status request.
         * @method status.handleRequest
         * @param caller {String} optional; the widget making the status request
         * @param types {String[]} optional; the types of status being requested. Array of strings;
         *      1.1 only supports "about", "format", and "view"
         * @memberof! module:EsriAdapter#
         */
        me.handleRequest = function(caller, types) {
            if(!types || types.indexOf("view") !== -1) {
                me.sendView(caller);
            }

            if(!types || types.indexOf("about") !== -1) {
                me.sendAbout(caller);
            }

            if(!types || types.indexOf("format") !== -1) {
                me.sendFormat(caller);
            }
        };
        CommonMapApi.status.request.addHandler(me.handleRequest);

        /**
         * Calculate the view details of the map and announce via the CMW-API
         * @method status.sendView
         * @param caller {String} The Id of the widget which requested the map view status
         * @memberof! module:EsriAdapter#
         */
        me.sendView = function(caller) {
            var bounds = {
                southWest: {
                    lat: map.geographicExtent.ymin,
                    lon: Extent.prototype._normalizeX(map.geographicExtent.xmin, map.geographicExtent.spatialReference._getInfo()).x
                },
                northEast: {
                    lat: map.geographicExtent.ymax,
                    lon: Extent.prototype._normalizeX(map.geographicExtent.xmax, map.geographicExtent.spatialReference._getInfo()).x
                }
            };

            var center = {
                lat: map.geographicExtent.getCenter().y,
                lon: Extent.prototype._normalizeX(map.geographicExtent.getCenter().x, map.geographicExtent.spatialReference._getInfo()).x
            };

            var range = map.getScale();

            CommonMapApi.status.view.send(caller, bounds, center, range);
        };

        /**
         * Compile the map about details and announce via the CMW-API
         * @private
         * @method status.sendAbout
         * @param caller {object} The Id of the widget which requested the map view status
         * @memberof! module:EsriAdapter#
         */
        me.sendAbout = function() {
            var version = EsriNS.version;
            var type = "2-D";
            var widgetName = OWF.getInstanceId();

            CommonMapApi.status.about.send(version, type, widgetName);
        };

        /**
         * Announce the accepted formats via the CMW-API
         * @private
         * @method status.sendFormat
         * @param caller {object} The Id of the widget which requested the map view status
         * @memberof! module:EsriAdapter#
         */
        me.sendFormat = function() {
            var formats = ["kml"/*, "geojson", "wms"*/];

            CommonMapApi.status.format.send(formats);
        };
    };

    return Status;
});