'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

const fieldClass =
  'mt-2 block w-full bg-surface px-4 py-3 text-[1rem] text-text placeholder:text-muted';

export default function ContactForm({ endpoint, email }: { endpoint?: string; email: string }) {
  const [status, setStatus] = useState<Status>('idle');

  if (!endpoint) {
    return (
      <p className="text-[1rem]">
        Email us at{' '}
        <a href={`mailto:${email}`} className="underline underline-offset-4">
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
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <label className="block text-[1rem]" htmlFor="contact-name">
        Name
        <input id="contact-name" name="name" required autoComplete="name" className={fieldClass} />
      </label>
      <label className="block text-[1rem]" htmlFor="contact-email">
        Email
        <input id="contact-email" name="email" type="email" required autoComplete="email" className={fieldClass} />
      </label>
      <label className="block text-[1rem]" htmlFor="contact-message">
        Message
        <textarea id="contact-message" name="message" required rows={5} className={fieldClass} />
      </label>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="min-h-11 bg-gold px-6 font-display uppercase tracking-wide text-(--color-base) disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      <p role="status" aria-live="polite" className="text-[1rem]">
        {status === 'sent' && 'Thank you. Your message was sent.'}
        {status === 'failed' &&
          `Your message could not be sent. Please try again, or email ${email}.`}
      </p>
    </form>
  );
}
