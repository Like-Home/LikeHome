import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// eslint-disable-next-line import/prefer-default-export
export function usePageParamsObject<T extends Record<string, string>>(): [T, (newParams: T) => void] {
  const [pageParams, setPageParams] = useSearchParams();
  const [params, setParams] = useState<T>(Object.fromEntries([...pageParams]) as T);

  useEffect(() => {
    setParams(Object.fromEntries([...pageParams]) as T);
  }, [pageParams]);

  return [
    params,
    (obj: T) => {
      const newParams = new URLSearchParams(obj);
      setPageParams(newParams);
    },
  ];
}
