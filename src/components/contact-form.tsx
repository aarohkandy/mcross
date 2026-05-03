"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type ContactFormProps = {
  ccEmails?: string[];
  email: string;
  phoneDisplay: string;
  phoneHref: string;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

const statusMessages: Record<Exclude<SubmissionState, "idle" | "submitting">, string> = {
  error: "Could not send. Please call or email us instead.",
  success: "Request sent. We’ll review the address and follow up with availability.",
};

type ContactField = {
  name: "name" | "address" | "phone" | "email";
  placeholder: string;
  type: "email" | "tel" | "text";
};

const quoteFields: ContactField[] = [
  { name: "name", placeholder: "Name", type: "text" },
  { name: "address", placeholder: "Property Address", type: "text" },
  { name: "phone", placeholder: "Phone", type: "tel" },
  { name: "email", placeholder: "Email", type: "email" },
];

type ContactLinkCardProps = {
  href: string;
  label: string;
  value: string;
  valueClassName?: string;
};

function ContactLinkCard({
  href,
  label,
  value,
  valueClassName = "",
}: ContactLinkCardProps) {
  return (
    <a
      href={href}
      className="contact-panel__contact-card group rounded-[1.35rem] border border-white/10 bg-[#070707] transition hover:border-[rgba(150,180,120,0.35)]"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[var(--accent)]/72">
            {label}
          </p>
          <p className={`mt-1 text-base text-white${valueClassName ? ` ${valueClassName}` : ""}`}>
            {value}
          </p>
        </div>
      </div>
    </a>
  );
}

function SubmissionStatus({
  message,
  state,
}: {
  message: string;
  state: SubmissionState;
}) {
  const isVisible = state === "success" || state === "error";
  const toneClass =
    state === "success"
      ? "border-[rgba(150,180,120,0.34)] bg-[rgba(150,180,120,0.09)] text-white"
      : "border-[rgba(220,120,100,0.34)] bg-[rgba(120,42,30,0.16)] text-white";

  return (
    <div className="mt-3 min-h-[3.5rem]" aria-live="polite">
      {isVisible ? (
        <div className={`rounded-[1.15rem] border px-4 py-3 text-sm leading-relaxed ${toneClass}`}>
          {message}
        </div>
      ) : null}
    </div>
  );
}

export function ContactForm({
  ccEmails = [],
  email,
  phoneDisplay,
  phoneHref,
}: ContactFormProps) {
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const replyTo = formData.get("email");

    formData.set("_subject", "New MCROSS quote request");
    formData.set("_url", window.location.href);
    formData.set("_replyto", typeof replyTo === "string" ? replyTo : "");

    if (ccEmails.length > 0) {
      formData.set("_cc", ccEmails.join(","));
    }

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const data = (await response.json().catch(() => null)) as
        | { message?: string; success?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to send request.");
      }

      form.reset();
      setState("success");
      setMessage(statusMessages.success);
    } catch {
      setState("error");
      setMessage(statusMessages.error);
    }
  }

  return (
    <div className="contact-panel relative overflow-hidden rounded-[2.4rem] border border-[#2b3822] bg-[linear-gradient(180deg,#11150d_0%,#090907_44%,#050505_100%)] shadow-[0_36px_120px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(174,207,133,0.1)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(160,193,121,0.65),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[18%] top-[-14%] h-28 rounded-full bg-[radial-gradient(circle,rgba(150,180,120,0.2),transparent_72%)] blur-3xl"
      />
      <p className="contact-panel__eyebrow text-xs uppercase tracking-[0.38em] text-[var(--accent)]/90">
        Fast Quote
      </p>
      <h2 className="contact-panel__title font-heading leading-[0.92] tracking-[0.08em] text-white">
        Sign Up
      </h2>

      <form className="contact-panel__form mt-6 grid" onSubmit={handleSubmit}>
        <input
          type="text"
          name="_honey"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {quoteFields.map((field) => (
          <input
            className="contact-panel__field rounded-[1.35rem] border border-white/9 bg-[#070707] px-5 text-base text-white outline-none transition placeholder:text-white/34 focus:border-[var(--accent)]"
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            required
            type={field.type}
          />
        ))}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="contact-panel__submit mt-1 rounded-[1.35rem] bg-[var(--accent)] px-4 text-sm font-semibold uppercase tracking-[0.22em] text-black shadow-[0_16px_42px_rgba(150,180,120,0.28)] transition hover:bg-[#aacb89] disabled:cursor-wait disabled:opacity-80"
        >
          {state === "submitting" ? "Sending" : "Request Quote"}
        </button>
      </form>

      <SubmissionStatus message={message} state={state} />

      <div className="contact-panel__links mt-4 grid gap-3">
        <ContactLinkCard
          href={phoneHref}
          label="Call"
          value={phoneDisplay}
          valueClassName="tracking-[0.12em]"
        />
        <ContactLinkCard
          href={`mailto:${email}`}
          label="Email"
          value={email}
        />
      </div>
    </div>
  );
}
