'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Place {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  estHours: number;
}

interface DayPlan {
  dayNumber: number;
  places: Place[];
}

// Урьдчилан бэлтгэсэн түгээмэл аяллын цэгүүд
const CATALOG_PLACES: Place[] = [
  { id: 'ub', name: 'Улаанбаатар (Сүхбаатарын талбай)', region: 'Төв', lat: 47.9188, lng: 106.9176, estHours: 2 },
  { id: 'terelj', name: 'Горхи-Тэрэлж БЦГ (Мэлхий хад)', region: 'Төв', lat: 47.9077, lng: 107.4258, estHours: 4 },
  { id: 'chinggis-statue', name: 'Чингис хааны морьт хөшөө (Цонжин болдог)', region: 'Төв', lat: 47.8105, lng: 107.5342, estHours: 2 },
  { id: 'khustai', name: 'Хустайн нуруу (Тахь нутагшуулах)', region: 'Төв', lat: 47.6978, lng: 105.8974, estHours: 4 },
  { id: 'yol-valley', name: 'Ёлын ам (Мөст хавцал)', region: 'Говь', lat: 43.4912, lng: 104.0721, estHours: 3 },
  { id: 'khongor-sand', name: 'Хонгорын элс (Дуут манхан)', region: 'Говь', lat: 43.7225, lng: 102.3211, estHours: 5 },
  { id: 'bayanzag', name: 'Баянзаг (Үлэг гүрвэлийн нутаг)', region: 'Говь', lat: 44.1378, lng: 103.7142, estHours: 3 },
  { id: 'khuvsgul', name: 'Хөвсгөл нуур (Хатгал боомт)', region: 'Хөвсгөл', lat: 50.4356, lng: 100.1584, estHours: 6 },
  { id: 'orkhon-waterfall', name: 'Улаан цутгалан (Орхоны хүрхрээ)', region: 'Хангай', lat: 46.7872, lng: 101.9614, estHours: 4 },
  { id: 'terkhiin-tsagaan', name: 'Тэрхийн цагаан нуур & Хорго', region: 'Архангай', lat: 48.1633, lng: 99.7214, estHours: 5 },
];

export default function PlannerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Бүгд');

  // Анхны өдрүүдийн хуваарь
  const [days, setDays] = useState<DayPlan[]>([
    {
      dayNumber: 1,
      places: [CATALOG_PLACES[0], CATALOG_PLACES[1]],
    },
    {
      dayNumber: 2,
      places: [CATALOG_PLACES[2]],
    },
  ]);

  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Өдөр нэмэх
  const addDay = () => {
    setDays((prev) => [
      ...prev,
      {
        dayNumber: prev.length + 1,
        places: [],
      },
    ]);
    setActiveDayIndex(days.length);
  };

  // Өдөр устгах
  const removeDay = (index: number) => {
    if (days.length <= 1) return;
    const newDays = days.filter((_, i) => i !== index).map((d, i) => ({ ...d, dayNumber: i + 1 }));
    setDays(newDays);
    if (activeDayIndex >= newDays.length) {
      setActiveDayIndex(newDays.length - 1);
    }
  };

  // Идэвхтэй өдөр рүү газар нэмэх
  const addPlaceToDay = (place: Place) => {
    setDays((prev) =>
      prev.map((day, i) => {
        if (i === activeDayIndex) {
          if (day.places.some((p) => p.id === place.id)) return day;
          return { ...day, places: [...day.places, place] };
        }
        return day;
      })
    );
  };

  // Өдрөөс газар хасах
  const removePlaceFromDay = (dayIndex: number, placeId: string) => {
    setDays((prev) =>
      prev.map((day, i) => {
        if (i === dayIndex) {
          return { ...day, places: day.places.filter((p) => p.id !== placeId) };
        }
        return day;
      })
    );
  };

  // Шүүлтүүртэй газрууд
  const filteredCatalog = CATALOG_PLACES.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'Бүгд' || p.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Нийт тооцоолол
  const totalPlacesCount = days.reduce((acc, d) => acc + d.places.length, 0);
  const activeDayPlaces = days[activeDayIndex]?.places || [];

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 flex flex-col">
      {/* Дээд статус мөр */}
      <header className="border-b border-neutral-200 bg-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/plan/safety-info" className="text-xs font-bold text-neutral-400 hover:text-neutral-700">
            ← Буцах
          </Link>
          <span className="text-neutral-200">|</span>
          <div>
            <h1 className="text-base font-black text-neutral-900 flex items-center gap-2">
              <span>Аяллын интерактив төлөвлөгч</span>
              <span className="text-[10px] font-mono bg-emerald-100 text-[#15803d] px-2 py-0.5 rounded-full font-bold">
                C08 SYSTEM
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-neutral-100 px-3 py-1.5 rounded-xl font-mono text-neutral-600">
            Нийт хугацаа: <strong>{days.length} өдөр</strong>
          </div>
          <div className="bg-emerald-50 px-3 py-1.5 rounded-xl font-mono text-[#15803d]">
            Сонгосон газар: <strong>{totalPlacesCount}</strong>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Хэвлэх / PDF татах
          </button>
        </div>
      </header>

      {/* Гол их бие: 2 Хуваагдсан талбар (Split View) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ЗҮҮН ТАЛ (Timeline & өдрүүд) */}
        <section className="w-full lg:w-[500px] xl:w-[560px] bg-white border-r border-neutral-200 flex flex-col shrink-0 h-auto lg:h-[calc(100vh-65px)] overflow-y-auto p-6 space-y-6">
          
          {/* Өдөр сонгох Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                Аяллын өдрүүд
              </span>
              <button
                onClick={addDay}
                className="text-xs font-bold text-[#15803d] hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                + Өдөр нэмэх
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {days.map((d, idx) => (
                <button
                  key={d.dayNumber}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    activeDayIndex === idx
                      ? 'bg-[#15803d] text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Өдөр {d.dayNumber} ({d.places.length})
                </button>
              ))}
            </div>
          </div>

          {/* Идэвхтэй өдрийн дэлгэрэнгүй жагсаалт */}
          <div className="p-5 rounded-3xl bg-[#fcfbf9] border border-neutral-200 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-neutral-900">
                Өдөр {days[activeDayIndex]?.dayNumber} хуваарь
              </h3>
              {days.length > 1 && (
                <button
                  onClick={() => removeDay(activeDayIndex)}
                  className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                >
                  Энэ өдрийг устгах
                </button>
              )}
            </div>

            {activeDayPlaces.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                Энэ өдөрт одоогоор газар сонгогдоогүй байна. <br />
                Доорх жагсаалтаас газар сонгож нэмнэ үү.
              </div>
            ) : (
              <div className="space-y-3">
                {activeDayPlaces.map((place, pIdx) => (
                  <div
                    key={place.id}
                    className="p-3.5 bg-white rounded-2xl border border-neutral-200/80 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#15803d] text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                        {pIdx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">{place.name}</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {place.region} бүс • ~{place.estHours} цаг зарцуулна
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removePlaceFromDay(activeDayIndex, place.id)}
                      className="text-neutral-400 hover:text-rose-600 text-sm px-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Газар нэмэх каталоги хэсэг */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
              Өдөр {days[activeDayIndex]?.dayNumber}-т газар нэмэх
            </span>

            {/* Хайлт & Бүсийн шүүлтүүр */}
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Газрын нэрээр хайх..."
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#15803d]"
              />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-2 text-xs font-medium outline-none text-neutral-700"
              >
                <option value="Бүгд">Бүх бүс</option>
                <option value="Төв">Төв</option>
                <option value="Говь">Говь</option>
                <option value="Хөвсгөл">Хөвсгөл</option>
                <option value="Хангай">Хангай</option>
                <option value="Архангай">Архангай</option>
              </select>
            </div>

            {/* Каталог картууд */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredCatalog.map((place) => {
                const isAlreadyAdded = activeDayPlaces.some((p) => p.id === place.id);
                return (
                  <div
                    key={place.id}
                    className="p-3 rounded-xl border border-neutral-200/60 bg-[#fcfbf9] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">{place.name}</h4>
                      <span className="text-[10px] text-neutral-400">{place.region} бүс</span>
                    </div>
                    <button
                      disabled={isAlreadyAdded}
                      onClick={() => addPlaceToDay(place)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        isAlreadyAdded
                          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                          : 'bg-[#15803d] hover:bg-emerald-950 text-white'
                      }`}
                    >
                      {isAlreadyAdded ? 'Нэмэгдсэн' : '+ Нэмэх'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* БАРУУН ТАЛ (Interactive Route Canvas / Map Visualizer) */}
        <section className="flex-1 bg-neutral-100 relative p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
          
          {/* Газрын зургийн талбар (Visual Canvas) */}
          <div className="w-full h-full min-h-[450px] bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            
            {/* Толгой хэсэг */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4 z-10">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#15803d] tracking-widest block mb-0.5">
                  MAP ROUTE OVERVIEW
                </span>
                <h3 className="text-lg font-black text-neutral-900">
                  Өдөр {days[activeDayIndex]?.dayNumber} чиглэлийн зураглал
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-xl">
                  Зочлох цэг: <strong>{activeDayPlaces.length}</strong>
                </span>
              </div>
            </div>

            {/* Маршрутын холбоос визуал дүрслэл */}
            <div className="my-auto py-8">
              {activeDayPlaces.length === 0 ? (
                <div className="text-center text-neutral-400">
                  <span className="text-3xl block mb-2">🗺️</span>
                  <p className="text-xs">
                    Зүүн талын жагсаалтаас цэг нэмэхэд энд маршрутын холболт дүрслэгдэнэ.
                  </p>
                </div>
              ) : (
                <div className="relative max-w-lg mx-auto space-y-6">
                  {/* Босоо холбоос шугам */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-dashed border-l-2 border-emerald-400 z-0" />

                  {activeDayPlaces.map((p, idx) => (
                    <div key={p.id} className="relative flex items-center gap-4 z-10">
                      <div className="w-8 h-8 rounded-full bg-[#15803d] text-white font-mono font-bold text-xs flex items-center justify-center shadow-md">
                        {idx + 1}
                      </div>
                      <div className="flex-1 bg-[#fcfbf9] border border-neutral-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900">{p.name}</h4>
                          <span className="text-[11px] text-neutral-500 font-mono">
                            Координат: {p.lat.toFixed(2)}°N, {p.lng.toFixed(2)}°E
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-50 text-[#15803d] px-2 py-1 rounded-md font-bold">
                          Stop #{idx + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Доод мэдээллийн хураангуй */}
            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2 z-10">
              <span>GPS координат ба газрын зураг бүрэн нийцсэн</span>
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span>Ногоон цэг: Эхлэл</span>
                <span>•</span>
                <span>Тасархай шугам: Авто замын коридор</span>
              </div>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}