import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/assets/images/logo-full-white.png';

import styles from './header.module.less';

const navs = [
  { id: 1, url: '/', title: 'Нүүр хуудас' },
  { id: 2, url: '/news', title: 'Мэдээ' },
  { id: 3, url: '/online-course', title: 'Онлайн хичээл' },
  { id: 4, url: '/trading-view', title: 'Trading view' },
];

const Header = () => (
  <div className={styles.header}>
    <div className="container">
      <div className="content flex items-center justify-between">
        <Link href="/">
          <a className="logo-link">
            <Image src={logo} />
          </a>
        </Link>
        <div className="navs flex">
          {navs.map((item) => (
            <Link key={item.id} href={item.url}>
              <a className="nav-link mr-10">{item.title}</a>
            </Link>
          ))}
        </div>
        <div className="buttons flex items-center">
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
);

export default Header;
