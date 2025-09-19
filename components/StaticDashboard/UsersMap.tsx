import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import useNotificationHashCreator from "@/hooks/useNotificationHashCreator";

export default function UsersMap({
  usersLocations,
}: Readonly<{
  usersLocations: {
    name: string;
    location: string;
    lat: number;
    long: number;
  }[];
}>) {
  const mapRef = useRef<L.Map>(null);
  // center set to London
  const latitude = 51.505;
  const longitude = -0.09;

  const icon = L.icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [13, 40],
    popupAnchor: [0, -46],
    shadowUrl: "/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const usersMapHash = useNotificationHashCreator({
    usersLocations: usersLocations.length,
  });
  return (
    <Card className="h-full flex flex-col h-[800px]">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Users Map</CardTitle>
          <CardDescription>
            Showing the location of users on a map (sample of 10k users)
          </CardDescription>
        </div>
      </CardHeader>
      <div className="flex-1 p-6 overflow-hidden">
        <div className="relative h-full w-full">
          <MapContainer
            center={[latitude, longitude]}
            zoom={1.3}
            minZoom={1.3}
            maxBounds={[
              [-90, -180], // Southwest coordinates
              [90, 180], // Northeast coordinates
            ]}
            ref={mapRef}
            style={{ height: "100%", width: "100%" }}
            className="rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.7}
            />
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 pointer-events-none rounded-lg z-[400]" />
          <MarkerClusterGroup chunkedLoading>
            {usersLocations.map((result, index) => {
              if (!result.lat || !result.long) return null;
              return (
                <Marker
                  key={`marker-${index}-${result.name}-${result.lat}-${result.long}`}
                  position={[result.lat, result.long]}
                  icon={icon}
                >
                  <Popup>
                    <div>
                      <strong>{result.name}</strong>
                      <br />
                      {result.location}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
        </div>
      </div>
    </Card>
  );
}
