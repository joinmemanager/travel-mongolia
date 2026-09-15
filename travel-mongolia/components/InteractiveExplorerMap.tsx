'use client';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import React, { useEffect, useRef } from 'react';

export interface PlaceItem {
  id: string;
  name: string;
  nameEn: string;
  category: 'nature' | 'camp' | 'food' | 'culture';
  aimag: string;
  coord: [number, number];
  rating: number;
  image: string;
  description: string;
}

// 21 аймаг тус бүрийн төв координат болон ойртох zoom түвшин
export const AIMAG_CENTERS: Record<
  string,
  { center: [number, number]; zoom: number }
> = {
  'Бүх аймаг': { center: [46.8625, 103.8467], zoom: 6 },
  Архангай: { center: [47.4764, 101.4542], zoom: 8 },
  'Баян-Өлгий': { center: [48.9708, 89.9622], zoom: 8 },
  Баянхонгор: { center: [46.1944, 100.7181], zoom: 7 },
  Булган: { center: [48.8125, 103.5347], zoom: 8 },
  'Говь-Алтай': { center: [45.75, 96.25], zoom: 7 },
  Говьсүмбэр: { center: [46.495, 108.57], zoom: 9 },
  'Дархан-Уул': { center: [49.4678, 105.9228], zoom: 10 },
  Дорноговь: { center: [44.8833, 110.1333], zoom: 7 },
  Дорнод: { center: [48.0717, 114.5325], zoom: 7 },
  Дундговь: { center: [45.7625, 106.2711], zoom: 8 },
  Завхан: { center: [48.2389, 96.6875], zoom: 7 },
  Орхон: { center: [49.0306, 104.0833], zoom: 11 },
  Өвөрхангай: { center: [45.75, 102.78], zoom: 8 },
  Өмнөговь: { center: [43.5658, 104.425], zoom: 7 },
  Сүхбаатар: { center: [46.6833, 113.2833], zoom: 7 },
  Сэлэнгэ: { center: [50.1142, 106.2078], zoom: 8 },
  Төв: { center: [47.5, 106.5], zoom: 8 },
  Увс: { center: [49.9811, 92.0667], zoom: 7 },
  Ховд: { center: [48.0056, 91.6419], zoom: 7 },
  Хөвсгөл: { center: [50.0, 100.16], zoom: 7 },
  Хэнтий: { center: [47.3236, 110.6556], zoom: 8 },
  'Улаанбаатар хот': { center: [47.9188, 106.9176], zoom: 11 },
};

interface Props {
  places: PlaceItem[];
  selectedPlace: PlaceItem | null;
  selectedAimag: string;
  onSelectPlace: (place: PlaceItem) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  nature: '#15803d',
  camp: '#0284c7',
  food: '#ea580c',
  culture: '#7c3aed',
};

export default function InteractiveExplorerMap({
  places,
  selectedPlace,
  selectedAimag,
  onSelectPlace,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [46.8625, 103.8467],
      zoom: 6,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 1. Хиймэл дагуулын бодит сансрын зураг (Бага зэрэг тодруулагч ангитай)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
        maxZoom: 18,
        className: 'satellite-base-layer',
      }
    ).addTo(map);

    // 2. ДЭЭР НЬ ДАВХАРЛАХ ОНЦГОЙ ТОД АНГЛИ ШОШГО & ЗАМУУД (High-Contrast Reference)
    L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        className: 'high-contrast-labels',
      }
    ).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Маркеруудыг зурах
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const color = CATEGORY_COLORS[place.category] || '#15803d';

      const customIcon = L.divIcon({
        className: 'custom-explorer-pin',
        html: `
          <div style="
            background: ${color};
            color: #fff;
            width: ${isSelected ? '36px' : '28px'};
            height: ${isSelected ? '36px' : '28px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            transition: all 0.2s ease;
            cursor: pointer;
            font-size: ${isSelected ? '14px' : '11px'};
            font-weight: 800;
          ">
            ${
              place.category === 'camp'
                ? '⛺'
                : place.category === 'food'
                ? '☕'
                : place.category === 'culture'
                ? '🏛'
                : '🏔'
            }
          </div>
        `,
        iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
        iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
      });

      const marker = L.marker(place.coord, { icon: customIcon });

      marker.on('click', () => {
        onSelectPlace(place);
      });

      markersGroupRef.current?.addLayer(marker);
    });
  }, [places, selectedPlace, onSelectPlace]);

  // Аймаг сонгогдох үед тухайн аймаг руу томруулж шилжих (FlyTo)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const target = AIMAG_CENTERS[selectedAimag] || AIMAG_CENTERS['Бүх аймаг'];
    map.flyTo(target.center, target.zoom, {
      duration: 1.4,
      easeLinearity: 0.25,
    });
  }, [selectedAimag]);

  // Тодорхой нэг газар/бааз дээр дарахад тухайн цэг рүү нарийвчилж томрох
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;

    map.flyTo(selectedPlace.coord, 10, {
      duration: 1.2,
    });
  }, [selectedPlace]);

  return <div ref={mapContainerRef} className="z-0 w-full h-full" />;
}
