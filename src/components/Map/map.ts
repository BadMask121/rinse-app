import L from "leaflet";

export default class Map {
  layer: L.TileLayer;
  locations: L.Marker<any>[];
  view: L.Map;
  constructor(domId: string, coordinate) {
    this.layer = L.tileLayer(
      "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 18,
        id: "openstreetmap.streets",
      }
    );
    this.view = L.map(domId).setView(coordinate, 10);
    this.layer.addTo(this.view);
    this.locations = [];
  }

  addLocation(
    coordinate: L.LatLngExpression,
    popup?: string,
    options?: L.ZoomPanOptions
  ) {
    const marker = L.marker(coordinate).addTo(this.view);
    if (popup) marker.bindPopup(popup);
    this.locations.push(marker);
  }

  cleanup() {
    this.view.remove();
  }
}
