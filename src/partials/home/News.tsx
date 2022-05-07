import { times } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';

import RightArrow from '@/public/assets/icons/rightArrow.svg';
import banner from '@/public/assets/sample/example.jpg';

import styles from './home.module.less';

const News = () => (
  <div className={styles.news}>
    <div className="container">
      <h4 className="blog-subtitle">NEWS</h4>
      <h2 className="blog-title">МЭДЭЭ, МЭДЭЭЛЭЛ</h2>

      <div className="news-wrap">
        {times(6).map((item: any) => (
          <div className="news-item" key={item}>
            <div
              style={{
                width: '100%',
                height: 240,
                position: 'relative',
                borderRadius: 5,
                overflow: 'hidden',
              }}
            >
              <Image alt="" src={banner} layout="fill" objectFit="cover" />
            </div>
            <h4 className="news-title">
              Сүүлийн үеийн санал асуулгаар америкчуудын 21 хувь нь...
            </h4>
            <p className="news-desc">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Consequatur dolor et ipsum pariatur quas repudiandae saepe sunt
              tempora temporibus? Esse facere, illo in numquam perspiciatis
              quasi recusandae rerum tempore vero!
            </p>
            <div className="flex justify-between items-center bottom">
              <div className="left">
                <p>2021-10-23 • 9 min read</p>
              </div>
              <div className="right">
                <Link href="/a">
                  <a className="flex items-center mr-5 more-btn">
                    Дэлгэрэнгүй <RightArrow className="ml-2" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default News;
