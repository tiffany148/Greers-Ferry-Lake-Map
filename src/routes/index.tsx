import { createFileRoute } from "@tanstack/react-router";
import { LakeApp } from "@/components/lake-app";
import { listCommunityCoves } from "@/lib/community-coves";
import { communityCoveToPlace } from "@/lib/places";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const rows = await listCommunityCoves();
      return rows.map(communityCoveToPlace);
    } catch {
      return [];
    }
  },
  component: Home,
});

function Home() {
  const initialCommunity = Route.useLoaderData();
  return <LakeApp initialCommunity={initialCommunity} />;
}
