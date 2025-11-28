export const onClearSearchParams = () => {
  return typeof window !== undefined
    ? window.history.replaceState({}, document.title, window.location.pathname)
    : "";
};
