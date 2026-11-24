// 2FA-ийн admin хуудсууд (монгол хэлээр). payload-totp-ийн өөрийн /setup-totp, /verify-totp хуудсыг эдгээрээр
// сольсон (payload.config.ts → admin.components.views), харин endpoint, cookie, access-ийн шалгалт нь plugin-ийх.
//   /admin/setup-totp  — QR код (олон утсаар уншуулж болно) + эхний код
//   /admin/verify-totp — нэвтрэх бүрт 6 оронтой код, эсвэл нөөц код
//   /admin/security    — нөөц код үүсгэх, QR-ийг дахин харуулах (шинэ утас), 2FA-г шинээр тохируулах
import { DefaultTemplate, MinimalTemplate } from '@payloadcms/next/templates';
import { Gutter } from '@payloadcms/ui';
import { redirect } from 'next/navigation';
import { Secret, TOTP } from 'otpauth';
import type { AdminViewServerProps } from 'payload';
import { toDataURL } from 'qrcode';
import React from 'react';

import { TOTP_OPTIONS } from '../security/totpOptions';
import { isTotpVerified, readTotpSecret, recoveryCodesLeft } from '../security/twoFactor';
import { CodeForm, RecoveryCodesPanel, RecoveryLogin, ResetTwoFactor } from './TwoFactorClient';

const routesOf = (props: AdminViewServerProps) => {
  const { routes } = props.initPageResult.req.payload.config;
  return { admin: routes.admin, api: routes.api };
};

const param = (props: AdminViewServerProps, key: string) => {
  const v = (props.searchParams as Record<string, string | string[] | undefined> | undefined)?.[key];
  return Array.isArray(v) ? v[0] : v;
};

// `back` нь query-ээс ирдэг: зөвхөн admin доторх харьцангуй зам (open redirect, javascript: хаах)
function safeBack(adminRoute: string, back?: string) {
  if (!back || !back.startsWith('/') || back.startsWith('//') || back.includes('\\')) return adminRoute;
  const inside = back === adminRoute || back.startsWith(`${adminRoute}/`) || back.startsWith(`${adminRoute}?`);
  return inside && !/\/(verify|setup)-totp/.test(back) ? back : adminRoute;
}

const qrDataUrl = (uri: string) => toDataURL(uri, { margin: 2, width: 240, color: { dark: '#000000', light: '#ffffff' } });

const totpFor = (label: string, secret: Secret) => new TOTP({ ...TOTP_OPTIONS, label, secret });

const LogoutLink = ({ adminRoute }: { adminRoute: string }) => (
  <p className="thm-2fa__muted">
    <a href={`${adminRoute}/logout`}>Гарах</a>
  </p>
);

export async function SetupView(props: AdminViewServerProps) {
  const { admin, api } = routesOf(props);
  const user: any = props.initPageResult.req.user;
  if (!user) redirect(`${admin}/login`);
  if (user.hasTotp) redirect(admin);

  // RFC 6238-ийн стандарт 160 бит; хуудсыг дахин ачаалбал шинэ түлхүүр (QR-ийг ДАХИН уншуулна)
  const secret = new Secret({ size: 20 });
  const totp = totpFor(user.email, secret);
  const qr = await qrDataUrl(totp.toString());

  return (
    <MinimalTemplate className="thm-2fa">
      <h1>2 шаттай баталгаажуулалт (2FA) тохируулах</h1>
      <p>Энэ CMS-д нэвтрэхэд нууц үгээс гадна утасны 6 оронтой код заавал шаардлагатай.</p>
      <ol className="thm-2fa__steps">
        <li>
          Утсандаа <strong>Google Authenticator</strong> (эсвэл Microsoft Authenticator, Authy) апп суулгана.
        </li>
        <li>
          Аппаа нээгээд <strong>«+» → «Scan a QR code»</strong> дарж доорх QR кодыг уншуулна.
        </li>
        <li>
          <strong>Энэ хаягийг хэд хэдэн хүн ашигладаг бол</strong> одоо, энэ хуудсыг хаалгүй,{' '}
          <strong>хүн бүрийн утсаар ижил QR кодыг уншуулна</strong>. Бүх утсанд ижил код гарна.
        </li>
        <li>Аль нэг утсан дээрх 6 оронтой кодыг доор оруулна.</li>
      </ol>
      <div className="thm-2fa__qr">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} width={240} height={240} alt="2FA QR код" />
        <details>
          <summary>QR уншихгүй бол: түлхүүрийг гараар оруулах</summary>
          <p className="thm-2fa__muted">
            Апп → «Enter a setup key». Account: <code>{user.email}</code>, Key:
          </p>
          <code className="thm-2fa__secret">{secret.base32.replace(/(.{4})/g, '$1 ').trim()}</code>
          <p className="thm-2fa__muted">Төрөл: Time based (цагт суурилсан).</p>
        </details>
      </div>
      <p>
        <strong>Апп дахь 6 оронтой код:</strong>
      </p>
      <CodeForm mode="setup" apiRoute={api} secret={secret.base32} next={`${admin}/security?first=1`} />
      <p className="thm-2fa__muted">
        Баталгаажуулсны дараа 10 нөөц код гарна — утас гээсэн үед хэрэгтэй тул заавал хадгална уу.
      </p>
      <LogoutLink adminRoute={admin} />
    </MinimalTemplate>
  );
}

export function VerifyView(props: AdminViewServerProps) {
  const { admin, api } = routesOf(props);
  const user: any = props.initPageResult.req.user;
  if (!user) redirect(`${admin}/login`);
  if (!user.hasTotp || isTotpVerified(user)) redirect(admin);
  const back = safeBack(admin, param(props, 'back'));

  return (
    <MinimalTemplate className="thm-2fa">
      <h1>Баталгаажуулах код</h1>
      <p>
        Утсан дээрх <strong>Google Authenticator</strong> апп-ыг нээж, <strong>«{TOTP_OPTIONS.issuer}»</strong>-ийн 6 оронтой
        кодыг оруулна уу. Код 30 секунд тутам солигдоно.
      </p>
      <CodeForm mode="verify" apiRoute={api} next={back} />
      <details className="thm-2fa__recovery">
        <summary>Утас дэргэд алга уу? Нөөц код ашиглах</summary>
        <p className="thm-2fa__muted">2FA-г тохируулахад гарсан 10 кодын аль нэгийг оруулна. Код бүр нэг удаа ажиллана.</p>
        <RecoveryLogin apiRoute={api} next={`${admin}/security?recovered=1`} />
      </details>
      <LogoutLink adminRoute={admin} />
    </MinimalTemplate>
  );
}

export async function SecurityView(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams } = props;
  const { admin, api } = routesOf(props);
  const req = initPageResult.req;
  const user: any = req.user;
  if (!user) redirect(`${admin}/login`);
  if (!isTotpVerified(user)) redirect(`${admin}/verify-totp?back=${encodeURIComponent(`${admin}/security`)}`);

  const left = await recoveryCodesLeft(req, user.id);
  const first = param(props, 'first') === '1';
  const recovered = param(props, 'recovered') === '1';
  let qr: { img: string; key: string } | null = null;
  if (param(props, 'qr') === '1') {
    const stored = await readTotpSecret(req, user.id);
    if (stored) {
      const totp = totpFor(user.email, Secret.fromBase32(stored));
      qr = { img: await qrDataUrl(totp.toString()), key: stored.replace(/(.{4})/g, '$1 ').trim() };
    }
  }

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={user}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter className="thm-2fa thm-2fa--page">
        <h1>Аюулгүй байдал: 2FA ба нөөц код</h1>
        <p className="thm-2fa__muted">
          Хаяг: <strong>{user.email}</strong>. Заавар: docs/admin/ЗААВАР.md, «2FA» хэсэг.
        </p>

        {recovered ? (
          <div className="thm-2fa__warn">
            Та нөөц кодоор нэвтэрлээ (тэр код дахин ажиллахгүй). Утсаа гээсэн бол доороос <strong>«2FA-г шинээр тохируулах»</strong>{' '}
            эсвэл өөр утсаа нэмж, шаардлагатай бол шинэ нөөц код үүсгэнэ үү.
          </div>
        ) : null}

        <section className="thm-2fa__section">
          <h2>1. Нөөц кодууд (recovery codes)</h2>
          <p>
            Утас дэргэд байхгүй, гээсэн, солигдсон үед нэвтрэх 10 нэг удаагийн код. Шинээр үүсгэхэд хуучин нь бүгд хүчингүй болно — хаягийг
            хамтран ашигладаг бол бусаддаа мэдэгдэнэ үү.
          </p>
          <RecoveryCodesPanel apiRoute={api} adminRoute={admin} left={left} autoGenerate={first && left === 0} />
        </section>

        <section className="thm-2fa__section">
          <h2>2. Өөр утас нэмэх (хамт ажилладаг хүний утас)</h2>
          {qr ? (
            <>
              <p>
                Шинэ утасны Google Authenticator → «+» → «Scan a QR code» → доорх кодыг уншуулна. Хуучин утаснууд хэвээр ажиллана.{' '}
                <strong>Энэ QR-ийг зураг авч, чатаар бүү илгээ</strong> — QR-тэй хүн бүр код үүсгэж чадна.
              </p>
              <div className="thm-2fa__qr">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr.img} width={240} height={240} alt="2FA QR код" />
                <details>
                  <summary>Түлхүүрийг гараар оруулах</summary>
                  <code className="thm-2fa__secret">{qr.key}</code>
                </details>
              </div>
              <p>
                <a className="thm-2fa__btn thm-2fa__btn--secondary" href={`${admin}/security`}>
                  QR-ийг нуух
                </a>
              </p>
            </>
          ) : (
            <p>
              <a className="thm-2fa__btn thm-2fa__btn--secondary" href={`${admin}/security?qr=1`}>
                QR кодыг харуулах
              </a>
            </p>
          )}
        </section>

        <section className="thm-2fa__section">
          <h2>3. 2FA-г шинээр тохируулах</h2>
          <p>
            Утас хулгайд алдсан, QR код гадагш алдагдсан, эсвэл хаягийг ашигладаг хүн ажлаас гарсан үед: хуучин түлхүүр ба нөөц кодууд устаж,
            шинэ QR гарна. Бүх хүн шинэ QR-ийг дахин уншуулна. Ажлаас гарсан хүн байвал <strong>нууц үгийг ч сольно</strong> (Account → Change
            Password).
          </p>
          <ResetTwoFactor apiRoute={api} adminRoute={admin} />
        </section>
      </Gutter>
    </DefaultTemplate>
  );
}
