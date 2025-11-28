import ReactGA from "react-ga4";
export const onTracker = (event) => {
  if (process.env.NEXT_PUBLIC_ENV === "prod") {
    ReactGA.event({
      category: event,
      label: event,
      action: `${event}`.toLowerCase(),
    });
  } else {
    console.log(`E: ${event}`.toLowerCase());
  }
};
