import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/logo-full-white.png';

import styles from './header.module.less';

const DesktopHeader = ({ navs }: any) => (
  <>
    <div className={styles.header}>
      <div className="container">
        <div className="flex justify-between items-center content">
          <Link href="/">
            <a className="logo-link">
              <Image src={logo} alt="logo" />
            </a>
          </Link>
          <div className="flex navs">
            {navs.map((item: any) => (
              <Link key={item.id} href={item.url}>
                <a className="mr-10 nav-link">{item.title}</a>
              </Link>
            ))}
          </div>
          <div className="flex items-center buttons">
            <Link href="/login">
              <a className="mr-10 text-white">Нэвтрэх</a>
            </Link>
            <Link href="/register">
              <a className="register-btn">Бүртгүүлэх</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.ph} />
  </>
);

export default DesktopHeader;
