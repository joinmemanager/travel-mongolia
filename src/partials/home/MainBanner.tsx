import Image from 'next/image';
import Link from 'next/link';

import DownloadIcon from '@/public/assets/icons/download.svg';
import banner from '@/public/assets/images/home/main_banner.jpg';

import styles from './home.module.less';

const MainBanner = () => (
  <div className={styles.mainBanner}>
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Image alt="" src={banner} layout="fill" objectFit="cover" />
    </div>
    <div className="meta">
      <h2 className="main-title">get more sales.</h2>
      <div className="flex items-center buttons">
        <Link href="/register">
          <a className="mr-5 register-btn">Бүртгүүлэх</a>
        </Link>
        <Link href="/login">
          <a className="flex mr-10 bg-white download-btn">
            <DownloadIcon className="mr-1.5" />
            <span className="btn-text">PDF танилцуулга татах</span>
          </a>
        </Link>
      </div>
    </div>
  </div>
);

export default MainBanner;
