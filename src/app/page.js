// app/preorders/page.js (Server Component)
import PreordersClient from "./PreordersClient";
import { fetchPreorders } from "@/lib/api/preorders";

export default async function PreordersPage({ searchParams }) {
  const filter = await searchParams;

  const querySearch = new URLSearchParams(filter);
  const queryString = querySearch.toString();

  const data = await fetchPreorders(queryString);

  // Format dates for display
  const formattedData = data.data.map((item) => ({
    ...item,
    startsAt: new Date(item.startsAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    endsAt: item.endsAt
      ? new Date(item.endsAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "",
  }));

  return (
    <PreordersClient
      initialPreorders={formattedData}
      total={data.meta.total}
      totalPages={data.meta.totalPages}
      currentPage={data.meta.page}
      filter={filter}
    />
  );
}