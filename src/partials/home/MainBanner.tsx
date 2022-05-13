import Image from 'next/image';
import Link from 'next/link';

import DownloadIcon from '@/public/assets/icons/download.svg';
import banner from '@/public/assets/images/home/main_banner.jpg';
import topBannerMobile from '@/public/assets/images/home/TopBannerMobile.jpg';
import { isMobile } from '@/utils/isMobile';

import styles from './home.module.less';

const MainBanner = () => (
  <div className={styles.mainBanner}>
    <div
      className="image-top"
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <Image
        alt=""
        src={isMobile() ? topBannerMobile : banner}
        layout="fill"
        objectFit="cover"
      />
    </div>
    <div className="container relative">
      <div className="meta">
        <h2 className="main-title">get more sales.</h2>
        <div className="block md:flex md:items-center buttons">
          <Link href="/register">
            <a className="block mr-5 mb-5 w-fit md:flex md:mb-0 register-btn">
              Бүртгүүлэх
            </a>
          </Link>
          <Link href="/login">
            <a className="flex mr-10 bg-white download-btn">
              <DownloadIcon
                className="mr-1.5"
                style={{ color: '#1C1C28', width: 25 }}
              />
              <span className="btn-text">PDF танилцуулга татах</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default MainBanner;
