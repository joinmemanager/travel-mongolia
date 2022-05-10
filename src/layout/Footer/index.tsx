import Image from 'next/image';
import Link from 'next/link';

import FbIcon from '@/public/assets/icons/socials/facebook-circle-green.svg';
import InstaIcon from '@/public/assets/icons/socials/instagram.svg';
import LinkedIcon from '@/public/assets/icons/socials/linkedin-green.svg';
import YoutubeIcon from '@/public/assets/icons/socials/youtube-green.svg';
import logo from '@/public/assets/images/logo-full-white.png';
import { isMobile } from '@/utils/isMobile';

import styles from './footer.module.less';

const Footer = () => {
  if (isMobile()) return null;
  return (
    <div className={styles.footer}>
      <div className="container my-0 mx-auto">
        <div className="grid grid-cols-5 gap-5">
          <div className="f-col">
            <Image src={logo} />
          </div>
          <div className="f-col">
            <h4 className="f-title">БИДНИЙ ТУХАЙ</h4>
            <Link href="/terms">
              <a className="footer-nav">Үйлчилгээний нөхцөл</a>
            </Link>
          </div>
          <div className="f-col">
            <h4 className="f-title">ТУСЛАМЖ</h4>
            <Link href="/terms">
              <a className="footer-nav">Түгээмэл асуулт, хариулт</a>
            </Link>
            <Link href="/terms">
              <a className="footer-nav">Аюулгүй байдал, нууцлал</a>
            </Link>
          </div>
          <div className="f-col">
            <h4 className="f-title">ХОЛБОО БАРИХ</h4>
            <Link href="/terms">
              <a className="footer-nav">7730-0202</a>
            </Link>
            <Link href="/terms">
              <a className="footer-nav">info@teslatraders.mn</a>
            </Link>
          </div>
          <div className="f-col">
            <h4 className="f-title">МЭДЭЭЛЭЛ АВАХ</h4>
          </div>
        </div>
        <div className="flex justify-between copyright-section">
          <div className="left">© 2021 БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.</div>
          <div className="flex items-center right">
            <Link href="/">
              <a className="mr-2">
                <FbIcon />
              </a>
            </Link>
            <Link href="/">
              <a className="mr-2">
                <InstaIcon />
              </a>
            </Link>
            <Link href="/">
              <a className="mr-2">
                <YoutubeIcon />
              </a>
            </Link>
            <Link href="/">
              <a>
                <LinkedIcon />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
