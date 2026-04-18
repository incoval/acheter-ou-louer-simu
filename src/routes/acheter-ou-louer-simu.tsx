import { createFileRoute } from "@tanstack/react-router";
import { BuyVsRentSimulator, simulatorHead } from "@/components/buy-vs-rent-simulator";

export const Route = createFileRoute("/acheter-ou-louer-simu")({
  component: BuyVsRentSimulator,
  head: () => ({
    meta: [
      { title: simulatorHead.title },
      {
        name: "description",
        content: simulatorHead.description,
      },
      {
        rel: "canonical",
        href: "/acheter-ou-louer-simu",
      },
    ],
  }),
});