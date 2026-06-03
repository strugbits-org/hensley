import Loading from "@/components/common/Loading";

// Loading boundary for the (root) segment, co-located with (root)/not-found.jsx
// and (root)/error.jsx. This restores the streaming spinner for on-demand
// renders (uncached dynamic pages / 404s) WITHOUT the app-root Suspense
// boundary that made notFound() stream-and-swap on the client (React #310).
export default function RootGroupLoading() {
  return <Loading />;
}
