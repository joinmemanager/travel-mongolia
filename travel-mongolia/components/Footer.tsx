'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          
          {/* 1-р багана: Лого, танилцуулга & Сошиал холбоосууд */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tighter text-white">
                mongolia<span className="text-[#15803d]">.</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Монгол орны онгон дагшин байгаль, нүүдэлчдийн олон зуун жилийн баялаг өв соёл, хязгааргүй уудам тал нутгийн аяллыг албан ёсны мэдээллээр хүргэж байна.
            </p>

            {/* Сошиал сувгууд */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block">
                Биднийг дагаарай
              </span>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61592368934535"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white hover:border-[#15803d] hover:bg-[#15803d] transition-all"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/travelhubmongolia/?__d=1utm_sourceig_embed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white hover:border-[#15803d] hover:bg-[#15803d] transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@travelhubmongolia7049"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white hover:border-[#15803d] hover:bg-[#15803d] transition-all"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* 2-р багана: Бүс нутаг */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-200">
              Бүс нутаг
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><Link href="/" className="hover:text-white transition-colors">Төв ба Хангай</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Хөвсгөл & Хойд бүс</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Говь нутаг</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Алтай & Баруун бүс</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Дорнод тал нутаг</Link></li>
            </ul>
          </div>

          {/* 3-р багана: Хэрэгцээт мэдээлэл */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-200">
              Хэрэгцээт мэдээлэл
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><Link href="/" className="hover:text-white transition-colors">Виз & Зорчих нөхцөл</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Цаг агаар ба улирал</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Тээвэр, машин түрээс</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Аяллын аюулгүй байдал</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Түгээмэл асуултууд</Link></li>
            </ul>
          </div>

          {/* 4-р багана: Холбоо барих мэдээлэл */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-200">
              Холбоо барих
            </h4>
            <div className="space-y-3 text-sm text-neutral-400">
              {/* Имэйл */}
              <div className="flex items-start gap-2.5">
                <span className="text-[#15803d] mt-0.5">✉</span>
                <a href="mailto:contact@joinme.mn" className="hover:text-white transition-colors">
                  contact@joinme.mn
                </a>
              </div>

              {/* Утас */}
              <div className="flex items-start gap-2.5">
                <span className="text-[#15803d] mt-0.5">📞</span>
                <a href="tel:+97677443939" className="hover:text-white transition-colors">
                  +976 7744-3939
                </a>
              </div>

              {/* Хаяг */}
              <div className="flex items-start gap-2.5">
                <span className="text-[#15803d] mt-0.5">📍</span>
                <span>
                  Улаанбаатар хот, Сүхбаатар дүүрэг, Чонон бөрт төв
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Доод хэсэг */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Mongolia Tourism. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-neutral-300 transition-colors">Нууцлалын бодлого</Link>
            <Link href="/" className="hover:text-neutral-300 transition-colors">Үйлчилгээний нөхцөл</Link>
            <Link href="/" className="hover:text-neutral-300 transition-colors">Холбоо барих</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}