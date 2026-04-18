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
    <div className="relative overflow-hidden rounded-[2.4rem] border border-[#2b3822] bg-[linear-gradient(180deg,#11150d_0%,#090907_44%,#050505_100%)] p-7 shadow-[0_36px_120px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(174,207,133,0.1)] sm:p-9">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(160,193,121,0.65),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[18%] top-[-14%] h-28 rounded-full bg-[radial-gradient(circle,rgba(150,180,120,0.2),transparent_72%)] blur-3xl"
      />
      <p className="text-xs uppercase tracking-[0.38em] text-[var(--accent)]/90">
        Fast Quote
      </p>
      <h2 className="font-heading text-[clamp(3rem,5.6vw,5rem)] leading-[0.92] tracking-[0.08em] text-white">
        Sign Up
      </h2>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
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
          className="h-15 rounded-[1.35rem] border border-white/9 bg-[#070707] px-5 text-base text-white outline-none transition placeholder:text-white/34 focus:border-[var(--accent)]"
        />
        <input
          type="text"
          name="address"
          placeholder="Property Address"
          required
          className="h-15 rounded-[1.35rem] border border-white/9 bg-[#070707] px-5 text-base text-white outline-none transition placeholder:text-white/34 focus:border-[var(--accent)]"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          required
          className="h-15 rounded-[1.35rem] border border-white/9 bg-[#070707] px-5 text-base text-white outline-none transition placeholder:text-white/34 focus:border-[var(--accent)]"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="h-15 rounded-[1.35rem] border border-white/9 bg-[#070707] px-5 text-base text-white outline-none transition placeholder:text-white/34 focus:border-[var(--accent)]"
        />

        <button
          type="submit"
          disabled={state === "submitting"}
          className="mt-1 h-15 rounded-[1.35rem] bg-[var(--accent)] px-4 text-sm font-semibold uppercase tracking-[0.22em] text-black shadow-[0_16px_42px_rgba(150,180,120,0.28)] transition hover:bg-[#aacb89] disabled:cursor-wait disabled:opacity-80"
        >
          {state === "submitting" ? "Sending" : "Request Quote"}
        </button>
      </form>

      <div className="mt-3 min-h-6 text-sm text-white/68" aria-live="polite">
        {message}
      </div>

      <div className="mt-4 grid gap-3">
        <a
          href={phoneHref}
          className="group rounded-[1.35rem] border border-white/10 bg-[#070707] px-5 py-4 transition hover:border-[rgba(150,180,120,0.35)]"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[var(--accent)]/72">
                Call
              </p>
              <p className="mt-1 text-base tracking-[0.12em] text-white">
                {phoneDisplay}
              </p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-white/62 transition group-hover:border-[rgba(150,180,120,0.35)] group-hover:text-white">
              Now
            </span>
          </div>
        </a>
        <a
          href={`mailto:${email}`}
          className="group rounded-[1.35rem] border border-white/10 bg-[#070707] px-5 py-4 transition hover:border-[rgba(150,180,120,0.35)]"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[var(--accent)]/72">
                Email
              </p>
              <p className="mt-1 text-base text-white">{email}</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-white/62 transition group-hover:border-[rgba(150,180,120,0.35)] group-hover:text-white">
              Open
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
