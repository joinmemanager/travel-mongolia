import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
// @ts-ignore
import worldData from 'world-atlas/countries-50m.json';

interface Props {
  lat: number;
  lon: number;
}

const WIDTH = 400;
const HEIGHT = 220;

export default function MongoliaLocatorMap({ lat, lon }: Props) {
  const countries = feature(worldData as any, (worldData as any).objects.countries) as any;
  const mongolia = countries.features.find((f: any) => f.id === '496');

  if (!mongolia) {
    return null;
  }

  const projection = geoMercator().fitSize([WIDTH, HEIGHT], mongolia);
  const pathGenerator = geoPath(projection);
  const d = pathGenerator(mongolia) || '';
  const point = projection([lon, lat]);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <path d={d} fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
      {point && (
        <>
          <circle cx={point[0]} cy={point[1]} r="10" fill="#15803d" opacity="0.25" />
          <circle cx={point[0]} cy={point[1]} r="5" fill="#15803d" stroke="white" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}