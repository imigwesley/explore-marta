const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/api/buses", async (req, res) => {
  try {
    const url =
      "https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb";

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    const vehicles = feed.entity.map((entity) => {
      const v = entity.vehicle;
      return {
        id: v.vehicle.id,
        route: v.trip?.routeId || null,
        lat: v.position.latitude,
        lon: v.position.longitude,
        bearing: v.position.bearing,
        timestamp: v.timestamp,
      };
    });

    res.json(vehicles);
  } catch (err) {
    console.error("Failed to fetch vehicles:", err);
    res.status(500).json({ error: "Could not load bus data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
