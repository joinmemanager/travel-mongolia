import Image from 'next/image';

import visionBanner from '@/public/assets/images/home/our_vision.jpg';
import rocket from '@/public/assets/images/home/rocket.png';
import { isMobile } from '@/utils/isMobile';

import styles from './home.module.less';

const OurVision = () => (
  <div className={styles.ourVision}>
    <div
      style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}
    >
      <Image
        alt="Mountains"
        src={isMobile() ? rocket : visionBanner}
        layout="fill"
        objectFit="cover"
      />
    </div>
    <div className="container content">
      <h5 className="c-subtitle">OUR VISION</h5>
      <h2 className="c-title">БИДНИЙ ЗОРИЛГО</h2>
      <p className="para">
        Дэлхийн хөрөнгийн зах зээлийн Монголын жинхэнэ мэргэжлийн акулуудыг
        бэлтгэх болно . Энэ нь үр хойч ирээдүй үедээ үлдээх үнэт зүйлсээр
        хэмжигдэж үлдэх учиртай юм. Бид агуу өвөг дээдсийнхээ түүхийг дахин
        морин дэлэн дээр бүтээж чадахгүй харин иргэн бүр нь дэлхийн дунджаас
        өндөр орлоготой ард түмэн болж байж тэр цагийг дахин бүтээж чадах болно
        .
      </p>
    </div>
  </div>
);

export default OurVision;
