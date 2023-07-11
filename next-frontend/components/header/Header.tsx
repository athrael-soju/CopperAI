import { gray } from '@ant-design/colors';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './header.module.css';
const { Button, Layout } = require('antd');
const { Header: AntdHeader } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: gray[3],
};

export default function Header() {
  const { data: session, status } = useSession();
  //const loading = status === "loading";

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
              listStyle: 'none',
              margin: 0,
            }}
          >
            <li>
              <Button
                type="link"
                href="https://github.com/athrael-soju/whisperChat"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#fff' }}
              >
                whisperChat
              </Button>
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
