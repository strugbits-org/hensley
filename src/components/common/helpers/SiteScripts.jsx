"use client";

import Script from "next/script";

/**
 * Renders site-wide third-party scripts (GTM, Google Analytics, Crisp chat)
 * driven entirely by per-tenant integration IDs from bps-core. Each block is
 * emitted only when its ID is present — a missing/empty ID disables that
 * integration with no placeholder or fallback.
 *
 * IDs are interpolated into inline scripts, so they must be trusted admin
 * values; we guard against malformed input with a light format check.
 */
export function SiteScripts({ integrations }) {
  const { crispWebsiteId, gtmId, gaMeasurementId } = integrations || {};

  const validGtmId = /^GTM-[A-Z0-9]+$/i.test(gtmId || "") ? gtmId : null;
  const validGaId = /^G-[A-Z0-9]+$/i.test(gaMeasurementId || "") ? gaMeasurementId : null;
  const validCrispId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(crispWebsiteId || "")
      ? crispWebsiteId
      : null;

  return (
    <>
      {validGtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${validGtmId}');`}
        </Script>
      )}

      {validGaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${validGaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${validGaId}');`}
          </Script>
        </>
      )}

      {validCrispId && (
        <Script id="crisp" strategy="afterInteractive">
          {`window.$crisp=[];window.CRISP_WEBSITE_ID="${validCrispId}";(function(){var d=document,s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
        </Script>
      )}
    </>
  );
}

export default SiteScripts;
