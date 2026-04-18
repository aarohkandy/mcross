"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type ContactFormProps = {
  email: string;
  phoneDisplay: string;
  phoneHref: string;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function ContactForm({
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
      setMessage("Request sent.");
    } catch {
      setState("error");
      setMessage("Could not send. Call or email instead.");
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2.3rem] border border-[#26311e] bg-[linear-gradient(180deg,#0d100a_0%,#070806_52%,#050505_100%)] p-6 shadow-[0_34px_110px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(174,207,133,0.1)] sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(160,193,121,0.65),transparent)]"
      />
      <p className="text-xs uppercase tracking-[0.38em] text-[var(--accent)]/90">
        Fast Quote
      </p>
      <h2 className="font-heading text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.92] tracking-[0.08em] text-white">
        Sign Up
      </h2>

      <form className="mt-6 grid gap-3.5" onSubmit={handleSubmit}>
        <input
          type="text"
          name="_honey"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="h-14 rounded-[1.25rem] border border-white/9 bg-[#060606] px-4.5 text-base text-white outline-none transition placeholder:text-white/34 focus:border-[var(--accent)]"
        />
        <input
          type="text"
          name="address"
          placeholder="Property Address"
          required
          className="h-14 rounded-[1.25rem] border border-white/9 bg-[#060606] px-4.5 text-base text-white outline-none transition placeholder:text-white/34 focus:border-[var(--accent)]"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          required
          className="h-14 rounded-[1.25rem] border border-white/9 bg-[#060606] px-4.5 text-base text-white outline-none transition placeholder:text-white/34 focus:border-[var(--accent)]"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="h-14 rounded-[1.25rem] border border-white/9 bg-[#060606] px-4.5 text-base text-white outline-none transition placeholder:text-white/34 focus:border-[var(--accent)]"
        />

        <button
          type="submit"
          disabled={state === "submitting"}
          className="mt-1 h-14 rounded-[1.25rem] bg-[var(--accent)] px-4 text-sm font-semibold uppercase tracking-[0.22em] text-black shadow-[0_14px_36px_rgba(150,180,120,0.24)] transition hover:bg-[#aacb89] disabled:cursor-wait disabled:opacity-80"
        >
          {state === "submitting" ? "Sending" : "Request Quote"}
        </button>
      </form>

      <div className="mt-3 min-h-6 text-sm text-white/68" aria-live="polite">
        {message}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <a
          href={phoneHref}
          className="rounded-[1.25rem] border border-white/10 bg-[#060606] px-4 py-4 text-center text-sm uppercase tracking-[0.2em] text-white transition hover:border-[rgba(150,180,120,0.35)]"
        >
          {phoneDisplay}
        </a>
        <a
          href={`mailto:${email}`}
          className="rounded-[1.25rem] border border-white/10 bg-[#060606] px-4 py-4 text-center text-sm text-white transition hover:border-[rgba(150,180,120,0.35)]"
        >
          {email}
        </a>
      </div>
    </div>
  );
}
