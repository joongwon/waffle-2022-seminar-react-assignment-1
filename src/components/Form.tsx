import { useId } from "react";
import styles from "./Form.module.css";

export function Form({ children, className, ...rest }: any) {
  return (
    <div className={`${className} ${styles["form"]}`} {...rest}>
      {children}
    </div>
  );
}

export function StaticField({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <>
      <label>{label}</label>
      <input value={value} disabled />
    </>
  );
}

type InputWithLabelArgs<T, N extends keyof T> = {
  textarea?: boolean;
  value: T;
  label: string;
  name: N;
  setValue: (value: T) => void;
} & (T[N] extends string
  ? {
      propToString?: (prop: T[N]) => string;
    }
  : {
      propToString: (prop: T[N]) => string;
    }) &
  (T[N] extends string
    ? {
        stringToProp?: (prop: string) => T[N];
      }
    : {
        stringToProp: (prop: string) => T[N];
      });

export function InputWithLabel<T, N extends keyof T>({
  value,
  label,
  name,
  setValue,
  propToString,
  stringToProp,
  textarea,
}: InputWithLabelArgs<T, N>) {
  const pts = propToString ?? ((x: string) => x);
  const stp = stringToProp ?? ((x: string) => x);
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea
          id={id}
          onChange={(e) => {
            setValue({ ...value, [name]: stp(e.target.value) });
          }}
          value={pts(value[name])}
        />
      ) : (
        <input
          id={id}
          onChange={(e) => {
            setValue({ ...value, [name]: stp(e.target.value) });
          }}
          value={pts(value[name])}
        />
      )}
    </>
  );
}
