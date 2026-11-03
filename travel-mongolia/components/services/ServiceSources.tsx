import React from 'react';

import { OSM_ATTRIBUTION, OSM_COPYRIGHT_URL } from '@/lib/serviceTypes';

// Эх сурвалжийн мөр: тухайн жагсаалтад орсон эх сурвалжуудыг л заана.
export default function ServiceSources({ joinme, osm, className }: { joinme: boolean; osm: boolean; className?: string }) {
  return (
    <p className={className}>
      Эх сурвалж:{' '}
      {joinme && 'joinme.mn'}
      {joinme && osm && ', '}
      {osm && (
        <a href={OSM_COPYRIGHT_URL} target="_blank" rel="noreferrer" className="underline hover:text-[#15803d]">
          {OSM_ATTRIBUTION}
        </a>
      )}
      . Утас, байршил зэрэг нь шинэчлэгдээгүй байж болно.
    </p>
  );
}
