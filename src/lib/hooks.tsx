import {
  Link,
  LinkProps,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "react-toastify";

export function useMySearchParams(key: string) {
  const [params, setParams] = useSearchParams();
  const search = params.get(key);
  const setSearch = useCallback(
    (newValue: string | null) => {
      setParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (newValue) newParams.set(key, newValue);
        else newParams.delete(key);
        return newParams;
      });
    },
    [key, setParams]
  );
  return [search, setSearch] as const;
}

export const useRedirectWithMessage = (
  shouldRedirect: boolean,
  message: string,
  path: string | -1
) => {
  const id = useId();
  const navigate = useNavigate();
  useEffect(() => {
    if (shouldRedirect) {
      toast.warning(message, { toastId: id });
      if (path === -1) navigate(-1);
      else navigate(path, { replace: true });
    }
  }, [id, message, navigate, path, shouldRedirect]);
};

export const RedirectWithMessage = ({
  message,
  to,
}: {
  message: string;
  to: string | -1;
}) => {
  const navigate = useNavigate();
  useEffectMountOrChange(() => {
    toast.warning(message);
    if (to === -1) navigate(-1);
    else navigate(to, { replace: true });
  }, []);
  return <>리다이렉트 중...</>;
};

export function ConditionalLink({
  to,
  children,
  ...props
}: Omit<LinkProps, "to"> & { to: LinkProps["to"] | null }) {
  return to ? (
    <Link to={to} {...props}>
      {children}
    </Link>
  ) : (
    <a {...props}>{children}</a>
  );
}

export function useSyncedState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    setState(initialState);
  }, [initialState]);
  return [state, setState] as const;
}

export const to = (
  strings: TemplateStringsArray,
  ...values: (string | number | undefined)[]
) =>
  values.some((v) => v === undefined)
    ? null
    : String.raw({ raw: strings }, ...values);

export function useEffectMountOrChange(effect: () => void, value: unknown[]) {
  const prevValue = useRef<unknown[] | null>(null);
  useEffect(() => {
    if (prevValue.current?.some((v, i) => value[i] !== v) ?? true) {
      prevValue.current = value;
      effect();
    }
  }, [effect, value]);
}
