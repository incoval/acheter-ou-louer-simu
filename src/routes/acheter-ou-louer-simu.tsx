import { createFileRoute } from "@tanstack/react-router";
import { BuyVsRentSimulator } from "@/components/buy-vs-rent-simulator";

export const Route = createFileRoute("/acheter-ou-louer-simu")({
  component: BuyVsRentSimulator,
});
