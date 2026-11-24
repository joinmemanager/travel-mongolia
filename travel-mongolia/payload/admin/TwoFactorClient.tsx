'use client';
// 2FA-ийн admin хуудсуудын client хэсэг (payload/admin/TwoFactorViews.tsx). Payload-ийн admin англи/орос хэлтэй
// (монгол орчуулга Payload-д байхгүй) тул эдгээр хуудсыг монголоор бичсэн.
import { useAuth, useConfig, useDocumentInfo } from '@payloadcms/ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type Json = { ok?: boolean; message?: string; codes?: string[]; left?: number; self?: boolean };

async function post(url: string, body: object): Promise<Json> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as Json & { errors?: { message?: string }[] };
    if (!res.ok && data.ok === undefined) return { ok: false, message: data.errors?.[0]?.message || `Алдаа (${res.status})` };
    return data;
  } catch {
    return { ok: false, message: 'Сервертэй холбогдож чадсангүй. Интернэтээ шалгана уу.' };
  }
}

// Plugin-ий англи алдааг монгол болгоно
function codeError(message?: string) {
  if (message && /many|locked|lock/i.test(message)) return 'Хэт олон буруу оролдлого — хаяг 15 минут түгжигдлээ. Дараа дахин оролдоно уу.';
  return 'Код буруу байна. Утасны цаг автомат (Network time) эсэхийг шалгаад, шинэ кодоор дахин оролдоно уу.';
}

/** 6 оронтой код: setup (QR уншуулсны дараа) эсвэл verify (нэвтрэх бүрт). */
export function CodeForm({ mode, apiRoute, secret, next }: { mode: 'setup' | 'verify'; apiRoute: string; secret?: string; next: string }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const submit = useCallback(
    async (value: string) => {
      if (pending || value.length !== 6) return;
      setPending(true);
      setError('');
      const data = await post(`${apiRoute}/${mode === 'setup' ? 'setup-totp' : 'verify-totp'}`, mode === 'setup' ? { token: value, secret } : { token: value });
      if (data.ok) {
        // location: auth strategy дахин ажиллах ёстой (plugin-тэй адил)
        window.location.replace(next);
        return;
      }
      setError(codeError(data.message));
      setToken('');
      setPending(false);
      input.current?.focus();
    },
    [apiRoute, mode, next, pending, secret],
  );

  return (
    <form
      className="thm-2fa__form"
      onSubmit={(e) => {
        e.preventDefault();
        void submit(token);
      }}
    >
      <input
        ref={input}
        className="thm-2fa__code"
        name="token"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        pattern="[0-9]{6}"
        maxLength={6}
        placeholder="000000"
        aria-label="6 оронтой код"
        value={token}
        disabled={pending}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, '').slice(0, 6);
          setToken(v);
          if (v.length === 6) void submit(v);
        }}
      />
      <button className="thm-2fa__btn" type="submit" disabled={pending || token.length !== 6}>
        {pending ? 'Шалгаж байна…' : 'Баталгаажуулах'}
      </button>
      {error ? <p className="thm-2fa__error" role="alert">{error}</p> : null}
    </form>
  );
}

/** Утас дэргэд байхгүй үед: нөөц кодоор нэвтрэх (код бүр нэг удаа). */
export function RecoveryLogin({ apiRoute, next }: { apiRoute: string; next: string }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  return (
    <form
      className="thm-2fa__form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!code.trim()) return;
        setPending(true);
        setError('');
        const data = await post(`${apiRoute}/users/use-recovery-code`, { code });
        if (data.ok) {
          window.location.replace(next);
          return;
        }
        setError(data.message || 'Нөөц код буруу.');
        setPending(false);
      }}
    >
      <input
        className="thm-2fa__code thm-2fa__code--recovery"
        name="code"
        autoComplete="off"
        spellCheck={false}
        placeholder="XXXXX-XXXXX"
        aria-label="Нөөц код"
        value={code}
        disabled={pending}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
      />
      <button className="thm-2fa__btn thm-2fa__btn--secondary" type="submit" disabled={pending || !code.trim()}>
        {pending ? 'Шалгаж байна…' : 'Нөөц кодоор нэвтрэх'}
      </button>
      {error ? <p className="thm-2fa__error" role="alert">{error}</p> : null}
    </form>
  );
}

/** Нөөц код үүсгэх, НЭГ удаа харуулах. autoGenerate: 2FA-г анх тохируулсны дараа автоматаар. */
export function RecoveryCodesPanel({ apiRoute, adminRoute, left, autoGenerate }: { apiRoute: string; adminRoute: string; left: number; autoGenerate: boolean }) {
  const [codes, setCodes] = useState<string[] | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);

  const generate = useCallback(async () => {
    setPending(true);
    setError('');
    const data = await post(`${apiRoute}/users/recovery-codes`, {});
    if (data.ok && data.codes) setCodes(data.codes);
    else setError(data.message || 'Нөөц код үүсгэж чадсангүй.');
    setPending(false);
  }, [apiRoute]);

  useEffect(() => {
    if (autoGenerate && !started.current) {
      started.current = true;
      void generate();
    }
  }, [autoGenerate, generate]);

  const text = codes
    ? `Travel Hub Mongolia CMS — 2FA нөөц кодууд (${new Date().toISOString().slice(0, 10)})\n` +
      `Код бүрийг НЭГ удаа ашиглана. Утас дэргэд байхгүй үед нэвтрэх хуудасны «Нөөц код ашиглах» хэсэгт оруулна.\n\n` +
      codes.join('\n') +
      '\n'
    : '';

  if (codes) {
    return (
      <div className="thm-2fa__codes-box">
        <p className="thm-2fa__warn">
          <strong>Эдгээр кодыг ОДОО хадгална уу.</strong> Хуудсыг хаасны дараа дахин харагдахгүй. Нууц үгээс тусад нь (жишээ нь
          хэвлээд түгжээтэй шургуулганд, эсвэл нууц үгийн менежерт) хадгална. Код бүр нэг удаа ажиллана.
        </p>
        <ol className="thm-2fa__codes">
          {codes.map((c) => (
            <li key={c}>
              <code>{c}</code>
            </li>
          ))}
        </ol>
        <div className="thm-2fa__row">
          <button
            type="button"
            className="thm-2fa__btn thm-2fa__btn--secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(text).catch(() => undefined);
              setCopied(true);
            }}
          >
            {copied ? 'Хуулагдлаа ✓' : 'Хуулах'}
          </button>
          <a
            className="thm-2fa__btn thm-2fa__btn--secondary"
            download="travelhub-cms-recovery-codes.txt"
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`}
          >
            Татаж авах (.txt)
          </a>
          <button type="button" className="thm-2fa__btn thm-2fa__btn--secondary" onClick={() => window.print()}>
            Хэвлэх
          </button>
          <a className="thm-2fa__btn" href={adminRoute}>
            Хадгалсан, үргэлжлүүлэх →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p>
        Үлдсэн нөөц код: <strong>{left}</strong> / 10.{' '}
        {left === 0 ? 'Нөөц код байхгүй байна — одоо үүсгэнэ үү.' : left <= 3 ? 'Цөөрсөн байна — шинээр үүсгэхийг зөвлөж байна.' : ''}
      </p>
      <button
        type="button"
        className="thm-2fa__btn"
        disabled={pending}
        onClick={() => {
          if (left > 0 && !window.confirm('Шинэ 10 код үүсгэхэд одоо байгаа бүх нөөц код хүчингүй болно. Үргэлжлүүлэх үү?')) return;
          void generate();
        }}
      >
        {pending ? 'Үүсгэж байна…' : left > 0 ? 'Шинэ нөөц код үүсгэх' : 'Нөөц код үүсгэх'}
      </button>
      {error ? <p className="thm-2fa__error" role="alert">{error}</p> : null}
    </div>
  );
}

/** 2FA-г бүхэлд нь шинээр тохируулах (бүх утас шинэ QR уншуулна). */
export function ResetTwoFactor({ apiRoute, adminRoute }: { apiRoute: string; adminRoute: string }) {
  const [error, setError] = useState('');
  return (
    <div>
      <button
        type="button"
        className="thm-2fa__btn thm-2fa__btn--danger"
        onClick={async () => {
          if (!window.confirm('2FA-г шинээр тохируулах уу? Одоо бүртгэгдсэн БҮХ утасны код ажиллахаа больж, нөөц кодууд устна. Дараагийн хуудсанд шинэ QR код гарна.')) return;
          const data = await post(`${apiRoute}/users/reset-totp`, {});
          if (data.ok) window.location.replace(`${adminRoute}/setup-totp`);
          else setError(data.message || 'Амжилтгүй.');
        }}
      >
        2FA-г шинээр тохируулах
      </button>
      {error ? <p className="thm-2fa__error" role="alert">{error}</p> : null}
    </div>
  );
}

/** Хэрэглэгчийн засах хуудсанд: админ тухайн хэрэглэгчийн 2FA-г шинэчилнэ (утсаа гээсэн хамт олны гишүүнд). */
export function UserTwoFactorField() {
  const { id } = useDocumentInfo();
  const { user } = useAuth();
  const {
    config: {
      routes: { admin: adminRoute, api: apiRoute },
    },
  } = useConfig();
  const [msg, setMsg] = useState('');
  if (!id) return null;
  const self = user && String(user.id) === String(id);
  return (
    <div className="field-type thm-2fa__field">
      <label className="field-label">2 шаттай баталгаажуулалт (2FA)</label>
      <p className="thm-2fa__muted">
        {self ? (
          <>
            Нөөц код, өөр утас нэмэх: <a href={`${adminRoute}/security`}>Аюулгүй байдал</a> хуудас.
          </>
        ) : (
          'Энэ хэрэглэгч утсаа гээж, нөөц кодгүй болсон бол 2FA-г нь шинэчилнэ: дараагийн нэвтрэлтэд шинэ QR код гарна.'
        )}
      </p>
      {!self ? (
        <button
          type="button"
          className="thm-2fa__btn thm-2fa__btn--danger"
          onClick={async () => {
            if (!window.confirm('Энэ хэрэглэгчийн 2FA ба нөөц кодыг устгах уу?')) return;
            const data = await post(`${apiRoute}/users/reset-totp`, { id });
            setMsg(data.ok ? 'Шинэчлэгдлээ. Дараагийн нэвтрэлтэд шинэ QR код гарна.' : data.message || 'Амжилтгүй.');
          }}
        >
          2FA-г шинэчлэх
        </button>
      ) : null}
      {msg ? <p className="thm-2fa__muted">{msg}</p> : null}
    </div>
  );
}

/** Зүүн цэсний доод холбоос. */
export function SecurityNavLink() {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig();
  return (
    <a className="thm-2fa__nav" href={`${adminRoute}/security`}>
      🔐 2FA ба нөөц код
    </a>
  );
}
