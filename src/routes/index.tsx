import { createFileRoute } from "@tanstack/react-router";
import { LakeApp } from "@/components/lake-app";
import { listCommunityCoves } from "@/lib/community-coves";
import { listFieldPins } from "@/lib/field-pins";
import { communityCoveToPlace, fieldPinToPlace, type Place } from "@/lib/places";

export const Route = createFileRoute("/")({
  loader: async (): Promise<Place[]> => {
    try {
      const [coves, pins] = await Promise.all([listCommunityCoves(), listFieldPins()]);
      return [...coves.map(communityCoveToPlace), ...pins.map(fieldPinToPlace)];
    } catch {
      return [];
    }
  },
  component: Home,
});

function Home() {
  const initialShared = Route.useLoaderData();
  return <LakeApp initialShared={initialShared} />;
}
