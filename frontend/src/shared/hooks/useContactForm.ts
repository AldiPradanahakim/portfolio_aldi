import { useCallback, useState } from 'react';
import { ContactError, sendContact, type ContactErrorCode, type ContactPayload } from '../lib/api';

type ContactStatus = 'idle' | 'submitting' | 'success' | 'error';

export function useContactForm() {
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [errorCode, setErrorCode] = useState<ContactErrorCode | 'UNKNOWN' | null>(null);

  const submit = useCallback(async (payload: ContactPayload) => {
    setStatus('submitting');
    setErrorCode(null);
    try {
      await sendContact(payload);
      setStatus('success');
      return true;
    } catch (cause) {
      // Only the code crosses this boundary; Contact owns the localised wording.
      setErrorCode(cause instanceof ContactError ? cause.code : 'UNKNOWN');
      setStatus('error');
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorCode(null);
  }, []);

  return { status, errorCode, submit, reset };
}
