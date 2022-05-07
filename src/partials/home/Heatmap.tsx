import Image from 'next/image';

import heatMap from '@/public/assets/images/market-heatmap.png';

import styles from './home.module.less';

const Heatmap = () => (
  <div className={styles.heatmap}>
    <div className="container">
      <h5 className="h-subtitle">HEATMAP</h5>
      <h2 className="h-title">Онлайн зураглал</h2>
      <div style={{ width: '100%', height: '770px', position: 'relative' }}>
        <Image alt="" src={heatMap} layout="fill" objectFit="contain" />
      </div>
    </div>
  </div>
);

export default Heatmap;
