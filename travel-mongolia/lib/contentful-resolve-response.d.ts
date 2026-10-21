// contentful-resolve-response (contentful.js-ийн link resolver) өөрийн type-гүй
declare module 'contentful-resolve-response' {
  export default function resolveResponse(
    response: any,
    options?: { removeUnresolved?: boolean; itemEntryPoints?: string[] }
  ): any[];
}
