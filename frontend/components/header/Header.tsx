import Link from 'next/link';
import { Button, Space, Layout } from 'antd';
import { gray } from '@ant-design/colors';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './header.module.css';

const { Header: AntdHeader } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: gray[8],
};

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <AntdHeader style={headerStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <nav>
          <ul
            style={{
              display: 'flex',
              gap: 20,
            }}
          >
            <li className={styles.navItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/client">Client</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/server">Server</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/admin">Admin</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/me">Me</Link>
            </li>
          </ul>
        </nav>
        {!session && (
          <div
            style={{
              display: 'flex',
              gap: 20,
              alignItems: 'center',
            }}
          >
            <span>You are not signed in</span>
            <Button
              type="primary"
              href={`/api/auth/signin`}
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              Sign in
            </Button>
          </div>
        )}
        {session?.user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {session.user.image && (
              <span
                style={{ backgroundImage: `url('${session.user.image}')` }}
                className={styles.avatar}
              />
            )}
            <span>
              <strong>{session.user.email ?? session.user.name}</strong>
            </span>
            <Button
              danger
              type="primary"
              href={`/api/auth/signout`}
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              Sign out
            </Button>
          </div>
        )}
      </div>
    </AntdHeader>
  );
}
