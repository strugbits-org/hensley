"use client";

// Last-resort boundary: catches errors thrown from the root layout / its
// client components (Header, Footer, Modals, etc.) during render or hydration.
// Without this, such an error blanks the page with React's raw
// "Application error: a client-side exception has occurred" message.
// global-error must render its own <html>/<body> and can't rely on the app's
// fonts/Tailwind, so styles are inlined.
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            background: "#f3efe7",
            color: "#2c2216",
            fontFamily: "Arial, Helvetica, sans-serif",
            textAlign: "center",
            padding: 24,
          }}
        >
          <h1 style={{ fontSize: 96, margin: 0, lineHeight: 1 }}>Oops</h1>
          <p style={{ maxWidth: 480, fontSize: 16 }}>
            Something went wrong while loading this page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              border: "1px solid #2c2216",
              background: "transparent",
              color: "#2c2216",
              padding: "14px 32px",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 2,
              fontSize: 12,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
