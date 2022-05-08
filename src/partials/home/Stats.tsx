import Image from 'next/image';
import { isMobile } from 'src/utils/isMobile';

import Bitcoin from '@/public/assets/images/home/Bitcoin.png';
import Percent from '@/public/assets/images/home/Discount.png';
import Users from '@/public/assets/images/home/Users.png';

import styles from './home.module.less';

const stats = [
  { id: 1, image: Users, amount: '+1000', label: 'сурагчид' },
  { id: 2, image: Bitcoin, amount: '+120', label: 'цагын хичээлүүд' },
  { id: 3, image: Percent, amount: '+14000%', label: 'хувьцааны үзүүлэлтүүд' },
];

const Stats = () => {
  return (
    <div className={styles.stats}>
      <div className="container stats-body">
        <h4 className="s-subtitle">statistics</h4>
        <h2 className="s-title">ҮЗҮҮЛЭЛТҮҮД</h2>
        <div className="stat-els">
          {stats.map(({ image, amount, label }, idx) => (
            <div className="stat" key={idx}>
              <div
                style={{
                  width: isMobile() ? '67px' : '126px',
                  height: isMobile() ? '67px' : '126px',
                  position: 'relative',
                  marginRight: 15,
                }}
              >
                <Image alt="" src={image} layout="fill" objectFit="contain" />
              </div>
              <div className="stat-meta">
                <h3 className="stat-amount">{amount}</h3>
                <p className="stat-label">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
