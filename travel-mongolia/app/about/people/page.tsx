'use client';

import React from 'react';
import Image from 'next/image';

export default function PeoplePage() {
  return (
    <main className="w-full bg-white text-neutral-900 pb-40 font-sans selection:bg-[#15803d] selection:text-white">
      
      {/* 1. HERO ХЭСЭГ */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2400"
          alt="Монгол хүн, хэл, үндэстний онцлог"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.58]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            03. People, Language & Identity
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Монгол хүн, хэл, үндэстний онцлог
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Хөх тэнгэрийн доорх эрх чөлөөт сэтгэлгээ, яруу баялаг хэл соёл, 20 гаруй угсаатны ялгарал ба уламжлалт зочломтгой зан
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-start sm:justify-center gap-3 overflow-x-auto scrollbar-none text-sm font-bold">
          <a href="#mongolians" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Монголчууд</a>
          <a href="#ethnic-groups" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Угсаатны бүлгүүд</a>
          <a href="#language" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Монгол хэл</a>
          <a href="#script" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Монгол бичиг</a>
          <a href="#naming" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Нэр, овог</a>
          <a href="#hospitality" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Зочломтгой зан</a>
          <a href="#lifestyle" className="px-5 py-2.5 rounded-full bg-[#15803d] text-white whitespace-nowrap shadow-xs">Амьдралын хэв маяг</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-24 space-y-36">

        {/* 1. МОНГОЛЧУУД */}
        <section id="mongolians" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">01. Үндэстний мөн чанар</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Монголчууд
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
              <p>
                Монголчууд бол эх байгальтайгаа хүйн холбоотой, эрс тэс уур амьсгалыг даван туулж ирсэн уян хатан, дасан зохицох онцгой чадвартай, тэвчээртэй ард түмэн юм.
              </p>
              <p>
                Хязгааргүй цэлийх уудам тал, нүүдэлчин амьдралын өвөрмөц хэв маяг нь монгол хүнийг эрх чөлөөг бүхнээс дээдэлдэг, уужим алсын хараатай, шулуун шуурхай сэтгэлгээтэй болгон төлөвшүүлжээ.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
                  <span className="text-xs sm:text-sm text-neutral-500 block font-bold uppercase tracking-wider mb-1">Гол зан чанар</span>
                  <strong className="text-lg sm:text-xl text-neutral-900 font-bold block">Уужим сэтгэл, тэсвэр хатуужил</strong>
                </div>
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
                  <span className="text-xs sm:text-sm text-neutral-500 block font-bold uppercase tracking-wider mb-1">Үнэт зүйл</span>
                  <strong className="text-lg sm:text-xl text-neutral-900 font-bold block">Эрх чөлөө, байгаль эх</strong>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 relative h-96 sm:h-[460px] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200"
                alt="Монголчууд"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* 2. УГСААТНЫ БҮЛГҮҮД */}
        <section id="ethnic-groups" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-8">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">02. Олон ястны өлгий</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Угсаатны бүлгүүд
            </h2>
          </div>

          <p className="text-base sm:text-xl text-neutral-700 font-normal leading-relaxed max-w-4xl mb-12">
            Монгол Улсад 20 гаруй ястан, угсаатны бүлэг өөрсдийн аялга, өвөрмөц дээл хувцас, ахуйн хосгүй онцлогийг өнөөг хүртэл өвлөн тээж, эв найртай зэрэгцэн оршдог.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-[#15803d] block mb-3">84%</span>
                <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Халх</h4>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Монгол үндэстний гол цөм болж, төрийн хэл, соёлын гол шугамыг тээгч.
                </p>
              </div>
            </div>

            <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-neutral-900 block mb-3">4%</span>
                <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Казах</h4>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Баян-Өлгий аймагт төвлөрсөн, бүргэдээр ан хийх хосгүй өв бүхий түрэг угсаатан.
                </p>
              </div>
            </div>

            <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#15803d] block mb-3">Баруун бүс</span>
                <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Ойрад ястнууд</h4>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Дөрвөд, Баяд, Захчин, Торгууд, Өөлд, Урианхай, Мянгад ястнуудын өлгий.
                </p>
              </div>
            </div>

            <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-neutral-900 block mb-3">Хойд & Зүүн</span>
                <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Буриад, Дархад, Цаатан</h4>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Тайгын бөө мөргөл, цаа бугын аж ахуй, уулын соёлыг тээгч хойд бүсийн угсаатнууд.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. МОНГОЛ ХЭЛ */}
        <section id="language" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">03. Эх хэл</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Монгол хэл
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
              <p>
                Монгол хэл нь Алтай язгуурын хэлний аймагт хамаардаг бөгөөд Монгол Улсын төрийн албан ёсны хэл юм. Хүний сэтгэлийн нарийн мэдрэмж, нүүдлийн ахуй, байгалийн төлөв байдлыг уран яруу, туйлын нарийн дүрсэлдэг гайхамшигт баялаг үгийн сантай.
              </p>
              <p>
                Өдгөө нийтийн хэрэглээнд Кирилл үсгийг хэрэглэхийн зэрэгцээ мянган жилийн түүхт үндэсний босоо Монгол бичгээ төрийн болон албан хэрэгт хослуулан сэргээж байна.
              </p>
            </div>
            <div className="lg:col-span-5 bg-emerald-50 p-8 sm:p-10 rounded-3xl border border-emerald-200 flex flex-col justify-center">
              <span className="text-sm font-black text-[#15803d] uppercase tracking-wider block mb-3">Хэлний сонирхолтой баримт</span>
              <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-medium">
                Монгол хэлэнд зөвхөн малын нас, зүс, биеийн галбир, эвэр шүдний шинжийг тодорхойлсон <strong>10,000 гаруй тусгай нэршил</strong> байдаг нь дэлхийн өөр ямар ч хэлэнд давтагдашгүй соёлын үнэт өв юм.
              </p>
            </div>
          </div>
        </section>

        {/* 4. МОНГОЛ БИЧИГ */}
        <section id="script" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">04. Босоо бичиг</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Монгол бичиг
            </h2>
          </div>

          <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-8 space-y-5">
                <span className="text-emerald-400 text-sm font-black uppercase tracking-widest block">
                  Мянган жилийн бичгийн соёл
                </span>
                <h3 className="text-3xl sm:text-4xl font-black leading-tight">
                  Тэнгэрээс газар луу нарны гэрэл мэт буудаг босоо бичиг
                </h3>
                <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
                  Монгол бичиг нь XIII зуунаас өмнө Согд үсгээс уламжлан бий болсон бөгөөд дэлхий дээрх цөөн дээрээс доош, зүүнээс баруун тийш бичигддэг босоо бичгийн тогтолцоо юм.
                </p>
                <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
                  Үсэг бүр нь үгийн эхэн, дунд, адагт орохдоо дүр төрхөө хувиргадаг уран бичлэгийн (каллиграфи) хосгүй урлагийн биелэл билээ.
                </p>
              </div>
              <div className="md:col-span-4 flex items-center justify-center p-8 bg-white/5 rounded-3xl border border-white/10 text-center min-h-[200px]">
                <span className="text-3xl sm:text-4xl font-serif tracking-widest text-emerald-300 font-bold">
                  ᠮᠣᠩᠭᠣᠯ ᠪᠢᠴᠢᠭ᠌
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. НЭР, ОВОГ */}
        <section id="naming" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">05. Угийн бичиг & Уламжлал</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Нэр, овгийн соёл
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4">
              <h4 className="text-2xl font-bold text-neutral-900">Ургийн овог ба Эцгийн нэр</h4>
              <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
                Монгол хүн эцгээрээ овоглож өөрийн нэрийг дууддаг (Жишээ нь: <em>Батбаярын Тэмүүлэн</em>). Мөн ураг удмаа мэдэх, цус ойртохоос сэргийлэх зорилгоор эртний овог (Боржигон, Хиад, Тайж г.м)-оо угийн бичигтээ нямбайлан тэмдэглэдэг.
              </p>
            </div>
            <div className="p-8 sm:p-10 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4">
              <h4 className="text-2xl font-bold text-neutral-900">Бэлгэдэлт нэр өгөх заншил</h4>
              <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
                Хүүхдэд нэр хайрлахдаа хүч чадал, баатарлаг чанар, эрдэм ном, байгалийн гоо үзэсгэлэн, урт удаан жаргалтай наслахыг бэлгэдсэн гүн утга төгөлдөр нэрсийг шинжин өгдөг нандин ёстой.
              </p>
            </div>
          </div>
        </section>

        {/* 6. ЗОЧЛОМТГОЙ ЗАН */}
        <section id="hospitality" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">06. Ариун ёс</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Зочломтгой зан чанар
            </h2>
          </div>

          <div className="bg-neutral-50 p-8 sm:p-14 rounded-3xl border border-neutral-200">
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-5">
              “Хаалга нь хэзээ ч цоожгүй, цай нь үргэлж халуунаараа”
            </h3>
            <p className="text-base sm:text-xl text-neutral-700 font-normal leading-relaxed mb-8 max-w-4xl">
              Монгол айлд танихгүй явуулын хүн ч орж ирсэн сүүтэй халуун цай чанаж, цагаан идээ, махан зоогоороо харамгүй дайлдаг. Уудам тал нутагт аянчин хүнийг ундаалж, дулаан хонуулах нь хүн бүрийн ариун журамт үүрэг гэж үздэг нүүдэлчдийн хосгүй ёс зүй юм.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-5 py-3 bg-white rounded-2xl text-sm sm:text-base font-bold border border-neutral-200 shadow-2xs">🍵 Сүүтэй халуун цай барих</span>
              <span className="px-5 py-3 bg-white rounded-2xl text-sm sm:text-base font-bold border border-neutral-200 shadow-2xs">🥛 Цагаан идээ дээжлэн таваглах</span>
              <span className="px-5 py-3 bg-white rounded-2xl text-sm sm:text-base font-bold border border-neutral-200 shadow-2xs">🤝 Хөөрөг зөрүүлэн амар мэндийг эрэх</span>
            </div>
          </div>
        </section>

        {/* 7. АМЬДРАЛЫН ХЭВ МАЯГ */}
        <section id="lifestyle" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">07. Ахуй ба Орчин үе</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Монгол хүний амьдралын хэв маяг
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-neutral-200 p-8 sm:p-12 rounded-3xl bg-white shadow-xs">
              <span className="text-sm uppercase tracking-widest text-[#15803d] font-black block mb-3">Уламжлалт хэв маяг</span>
              <h4 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">Хөдөө талын нүүдэлчин ахуй</h4>
              <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
                Эсгий гэрт амьдарч, таван хошуу малаа байгалийн бэлчээрээр маллан, дөрвөн улирлын байгалийн жамаар нүүдэллэн амьдрах уламжлалт эко соёл хэвээр хадгалагдсаар байна.
              </p>
            </div>
            <div className="border border-neutral-200 p-8 sm:p-12 rounded-3xl bg-white shadow-xs">
              <span className="text-sm uppercase tracking-widest text-neutral-400 font-black block mb-3">Орчин үе</span>
              <h4 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">Орчин үеийн хотын залуус</h4>
              <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
                Өндөр боловсролтой, гадаад хэлээр чөлөөтэй ярьдаг, технологийн дэвшлийг ашиглан дэлхийн түвшинд ажиллаж буй бүтээлч, эрч хүчтэй шинэ үеийнхэн юм.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}