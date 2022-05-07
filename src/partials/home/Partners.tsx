import Image from 'next/image';

import facebook from '@/public/assets/sample/facebook.png';
import forbes from '@/public/assets/sample/forbes.png';
import github from '@/public/assets/sample/github.png';
import google from '@/public/assets/sample/google.png';
import microsoft from '@/public/assets/sample/microsoft.png';

import styles from './home.module.less';

const partnersLogo = [
  { id: 1, src: github },
  { id: 2, src: forbes },
  { id: 3, src: google },
  { id: 4, src: microsoft },
  { id: 5, src: facebook },
];

const Partners = () => (
  <div className={styles.partners}>
    <div className="container">
      <h4 className="p-subtitle">PARTNERS</h4>
      <h2 className="p-title">ХАМТРАГЧИД</h2>
      <div className="logos">
        {partnersLogo.map((item) => (
          <div
            key={item.id}
            style={{
              width: '100%',
              height: 35,
              position: 'relative',
              borderRadius: 5,
              overflow: 'hidden',
            }}
          >
            <Image alt="" src={item.src} layout="fill" objectFit="contain" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Partners;
