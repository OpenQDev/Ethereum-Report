import { useMemo } from "react";

const useNotificationHashCreator = (object: object) => {
  const hash = useMemo(() => JSON.stringify(object), Object.values(object));

  return hash;
};

export default useNotificationHashCreator;
