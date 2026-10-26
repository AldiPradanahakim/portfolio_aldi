import { useAdminSession } from '../data/store';
import { useDocumentTitle } from '../shared/hooks/useDocumentTitle';
import { Login } from './Login';
import { Dashboard } from './Dashboard';

export default function AdminApp() {
  const admin = useAdminSession();
  useDocumentTitle('Panel CMS — Aldi Pradana Hakim');

  if (!admin.ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <p className="font-mono text-small text-chalk-faint">Memuat panel…</p>
      </div>
    );
  }

  if (!admin.session) {
    return (
      <Login
        source={admin.source}
        authMode={admin.authMode}
        configured={admin.configured}
        error={admin.error}
        signIn={admin.signIn}
      />
    );
  }

  return <Dashboard email={admin.session.email} source={admin.source} signOut={admin.signOut} />;
}