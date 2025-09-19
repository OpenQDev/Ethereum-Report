import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const useNotificationHash = (hash: string) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    if (hash) {
      const storedHash = Cookies.get(hash);
      if (storedHash) {
        setIsVisible(false);
      }
    }
  }, [hash]);
  const handleClose = () => {
    setIsVisible(false);

    if (hash) {
      Cookies.set(hash, "true", { expires: 365, path: "/" });
    }
  };

  return {
    isVisible,
    handleClose,
  };
};

export default useNotificationHash;
