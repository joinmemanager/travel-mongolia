import logo from 'images/logo-full-white.png';
import Image from 'next/image';
import Link from 'next/link';

import BurgerMenu from '@/public/assets/icons/BurgerMenu.svg';

import styles from './header.module.less';

const MobileHeader = () => (
  <>
    <div className={styles.header}>
      <div className="container">
        <div className="flex justify-between items-center content">
          <Link href="/">
            <a className="flex logo-link">
              <Image src={logo} alt="logo" />
            </a>
          </Link>
          <button type="button">
            <BurgerMenu />
          </button>
        </div>
      </div>
    </div>
    <div className={styles.ph} />
  </>
);

export default MobileHeader;
