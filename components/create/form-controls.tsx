"use client";

import { useId } from "react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export const controlClassName =
  "w-full rounded-2xl border border-[#ded1d4] bg-[#fffdfc] px-4 py-3.5 text-sm text-[#4f2835] outline-none transition placeholder:text-[#b49fa5] hover:border-[#c9b3b9] focus:border-[#9b4961] focus:ring-4 focus:ring-[#ead9de]/70";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  labelClassName?: string;
};

export function TextField({
  label,
  hint,
  labelClassName = "",
  className = "",
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className={`text-sm font-semibold ${labelClassName || "text-[#59303d]"}`}
        >
          {label}
        </label>
        {hint ? <span className="text-[10px] font-medium text-[#9d858c]">{hint}</span> : null}
      </div>
      <input id={id} className={`${controlClassName} ${className}`} {...props} />
    </div>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
};

export function TextAreaField({
  label,
  hint,
  className = "",
  ...props
}: TextAreaFieldProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-[#59303d]">
          {label}
        </label>
        {hint ? <span className="text-[10px] font-medium text-[#9d858c]">{hint}</span> : null}
      </div>
      <textarea id={id} className={`${controlClassName} resize-none ${className}`} {...props} />
    </div>
  );
}

type FieldGroupProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FieldGroup({ title, description, children }: FieldGroupProps) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="font-serif text-2xl font-semibold tracking-[-0.025em] text-[#4e2230]">
        {title}
      </legend>
      {description ? <p className="mt-1 text-sm leading-6 text-[#897078]">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}
