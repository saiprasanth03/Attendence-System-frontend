import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

function SearchControl() {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true,
      position: "topleft"
    })
      .on("markgeocode", function (e) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          bbox.getSouthEast(),
          bbox.getNorthEast(),
          bbox.getNorthWest(),
          bbox.getSouthWest(),
        ]);
        map.fitBounds(poly.getBounds());
      })
      .addTo(map);

    return () => {
      map.removeControl(geocoder);
    };
  }, [map]);

  return null;
}

export default function PolygonMap({
  setPolygon,
  existingPolygon = []
}) {
  const featureGroupRef = useRef();

  useEffect(() => {
    if (!featureGroupRef.current) return;
    if (!existingPolygon || existingPolygon.length === 0) return;

    const layerGroup = featureGroupRef.current;
    layerGroup.clearLayers();

    // 🔁 Convert [lng, lat] → [lat, lng] for Leaflet
    const leafletCoords = existingPolygon.map(coord => [
      coord[1],
      coord[0]
    ]);

    const polygon = L.polygon(leafletCoords);
    layerGroup.addLayer(polygon);

  }, [existingPolygon]);

  return (
    <MapContainer
      center={[16.5660, 81.5225]}
      zoom={17}
      style={{ height: "400px", width: "100%" }}
    >
      <SearchControl />

      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
          }}

          onCreated={(e) => {
            const layer = e.layer;
            const latlngs = layer.getLatLngs()[0];

            // 🔥 Save in GeoJSON format [lng, lat]
            const coordinates = latlngs.map((point) => [
              point.lng,
              point.lat,
            ]);

            setPolygon(coordinates);
          }}

          onEdited={(e) => {
            e.layers.eachLayer((layer) => {
              const latlngs = layer.getLatLngs()[0];

              const coordinates = latlngs.map((point) => [
                point.lng,
                point.lat,
              ]);

              setPolygon(coordinates);
            });
          }}

          onDeleted={() => {
            setPolygon([]);
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
