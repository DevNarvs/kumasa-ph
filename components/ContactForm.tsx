'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

const fieldClass =
  'mt-2 block min-h-14 w-full bg-[var(--bg)] px-4 py-3 text-[18px] text-[var(--ink)] placeholder:text-[var(--muted)] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[var(--accent-ink)]';

export default function ContactForm({ endpoint, email }: { endpoint?: string; email: string }) {
  const [status, setStatus] = useState<Status>('idle');

  if (!endpoint) {
    return (
      <p className="statement">
        Email us at{' '}
        <a href={`mailto:${email}`} className="underline decoration-2 underline-offset-4">
          {email}
        </a>
        .
      </p>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    try {
      const response = await fetch(endpoint as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
        }),
      });
      if (!response.ok) throw new Error(`Form endpoint answered ${response.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl space-y-6">
      <label className="block text-[18px] font-bold [font-stretch:85%]" htmlFor="contact-name">
        Name
        <input id="contact-name" name="name" required autoComplete="name" className={fieldClass} />
      </label>
      <label className="block text-[18px] font-bold [font-stretch:85%]" htmlFor="contact-email">
        Email
        <input id="contact-email" name="email" type="email" required autoComplete="email" className={fieldClass} />
      </label>
      <label className="block text-[18px] font-bold [font-stretch:85%]" htmlFor="contact-message">
        Message
        <textarea id="contact-message" name="message" required rows={5} className={fieldClass} />
      </label>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn min-h-14 bg-[var(--bg)] px-7 text-[18px] font-bold [font-stretch:85%] text-[var(--ink)] disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      <p role="status" aria-live="polite" className="text-[18px]">
        {status === 'sent' && 'Thank you. Your message was sent.'}
        {status === 'failed' &&
          `Your message could not be sent. Please try again, or email ${email}.`}
      </p>
    </form>
  );
}
