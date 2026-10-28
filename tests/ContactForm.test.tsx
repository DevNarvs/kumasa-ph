import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import ContactForm from '@/components/ContactForm';
import ContactPage from '@/app/contact/page';

afterEach(() => vi.unstubAllGlobals());

async function fill(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Juan Dela Cruz');
  await user.type(screen.getByLabelText('Email'), 'juan@example.com');
  await user.type(screen.getByLabelText('Message'), 'I would like to train.');
}

describe('ContactForm', () => {
  test('with an endpoint the form posts name, email and message and shows a success message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactForm endpoint="https://forms.example/abc" email="info@kumasa.example" />);
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://forms.example/abc');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({
      name: 'Juan Dela Cruz',
      email: 'juan@example.com',
      message: 'I would like to train.',
    });
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Thank you'));
  });

  test('a failed post shows an error and keeps the typed values', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const user = userEvent.setup();
    render(<ContactForm endpoint="https://forms.example/abc" email="info@kumasa.example" />);
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('could not be sent'));
    expect(screen.getByLabelText('Name')).toHaveValue('Juan Dela Cruz');
    expect(screen.getByLabelText('Message')).toHaveValue('I would like to train.');
  });

  test('a network error is treated as a failed post', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    const user = userEvent.setup();
    render(<ContactForm endpoint="https://forms.example/abc" email="info@kumasa.example" />);
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('could not be sent'));
  });

  test('without an endpoint it renders a mailto link instead of a form', () => {
    render(<ContactForm email="info@kumasa.example" />);
    expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'info@kumasa.example' })).toHaveAttribute(
      'href',
      'mailto:info@kumasa.example',
    );
  });

  test('required fields block submission', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactForm endpoint="https://forms.example/abc" email="info@kumasa.example" />);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Name')).toBeRequired();
    expect(screen.getByLabelText('Email')).toBeRequired();
    expect(screen.getByLabelText('Message')).toBeRequired();
  });
});

describe('Contact page', () => {
  test('contact page has one h1, the contact details and a way to get in touch', () => {
    render(<ContactPage />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByText('info@kumasa.ph').length).toBeGreaterThan(0);
  });
});
