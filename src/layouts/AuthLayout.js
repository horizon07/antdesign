import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import SelectLang from '@/components/SelectLang';
import styles from './AuthLayout.less';
import logo from '../assets/logo.svg';

class AuthLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{formatMessage({ id: 'Happy Dong' })}</span>
              </Link>
            </div>
            <div className={styles.desc}>{formatMessage({ id: 'Happy Dong Slogan' })}</div>
          </div>
          {children}
        </div>
      </div>
    );
  }
}

export default AuthLayout;
