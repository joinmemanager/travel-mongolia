'use client';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import React, { useEffect, useRef } from 'react';

export interface RouteMapData {
  name: string;
  distance: string;
  duration: string;
  coords: [number, number][];
  stops: { name: string; coord: [number, number]; highlight: string }[];
}

interface Props {
  route: RouteMapData;
}

export default function RealRouteMap({ route }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [46.8625, 103.8467],
      zoom: 6,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // ESRI World Topo Map: Бүх нэршил нь тод англиар, уулсын бодит рельеф бүхий дэлхийн жишиг зураг
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ',
        maxZoom: 18,
      }
    ).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (polylineRef.current) {
      polylineRef.current.remove();
    }
    if (markersRef.current) {
      markersRef.current.clearLayers();
    }

    // Замын зураас
    const polyline = L.polyline(route.coords, {
      color: '#15803d',
      weight: 5,
      opacity: 0.95,
      dashArray: '8, 8',
    }).addTo(map);
    polylineRef.current = polyline;

    // Пин маркерууд (Нэрсийг нь доор нь шууд ил англи шошготой гаргана)
    route.stops.forEach((stop, index) => {
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
            <!-- Пин тоо -->
            <div style="
              background-color: #15803d;
              color: #ffffff;
              font-size: 11px;
              font-weight: 800;
              width: 26px;
              height: 26px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            ">
              ${index + 1}
            </div>
            <!-- Газрын нэршил (байнга ил харагдана) -->
            <div style="
              background: rgba(15, 23, 42, 0.85);
              color: #ffffff;
              font-size: 10px;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 4px;
              margin-top: 3px;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.25);
              border: 1px solid rgba(255,255,255,0.2);
            ">
              ${stop.name}
            </div>
          </div>
        `,
        iconSize: [30, 50],
        iconAnchor: [15, 13],
      });

      const marker = L.marker(stop.coord, { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; min-width: 140px;">
          <div style="font-size: 10px; font-weight: 800; color: #15803d; text-transform: uppercase;">Stop #${
            index + 1
          }</div>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 2px;">${
            stop.name
          }</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${
            stop.highlight
          }</div>
        </div>
      `);

      markersRef.current?.addLayer(marker);
    });

    map.fitBounds(polyline.getBounds(), {
      padding: [60, 60],
      maxZoom: 8,
      animate: true,
    });
  }, [route]);

  return (
    <div className="relative w-full h-full min-h-[550px] lg:min-h-[640px]">
      <div
        ref={mapContainerRef}
        className="overflow-hidden z-0 w-full h-full rounded-2xl"
      />

      <div className="flex absolute bottom-4 left-4 z-10 gap-3 items-center py-2 px-3.5 text-xs bg-white/90 rounded-xl border border-neutral-200 shadow-sm backdrop-blur-md pointer-events-none">
        <span className="font-bold text-neutral-800">{route.name}</span>
        <span className="text-neutral-400">|</span>
        <span className="font-semibold text-[#15803d]">{route.distance}</span>
        <span className="text-neutral-400">|</span>
        <span className="text-neutral-600">{route.duration}</span>
      </div>
    </div>
  );
}
