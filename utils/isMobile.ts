export const isMobile = () => {
  if (typeof window === "undefined") return false;

  const userAgent = navigator.userAgent || navigator.vendor;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
};
