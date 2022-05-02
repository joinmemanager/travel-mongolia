import { Button } from 'components';
import BoxIcon from 'icons/colored/box.svg';
import CodeIcon from 'icons/colored/code.svg';
import GraphIcon from 'icons/colored/graph.svg';
import { useRouter } from 'next/router';

import styles from './home.module.less';

const levels = [
  {
    icon: <GraphIcon />,
    title: 'Анхан шат',
    description:
      'Анхан шатны багц хичээлийг суралцсанаар та энэхүү зах зээлд ямар их хэмжээний...',
  },
  {
    icon: <CodeIcon />,
    title: 'Дунд шат',
    description:
      'Арилжааны аргачлалд суралцаж, Техник болон Суурь шинжилгээнүүдийг...',
  },
  {
    icon: <BoxIcon />,
    title: 'Гүнзгий шат',
    description:
      'Сонголтод арилжааны нарийн зохион байгуулалт, ашигтай ажиллах боломжид...',
  },
];

const OnlineCourse = () => {
  const { replace } = useRouter();
  return (
    <div className={styles.onlineCourse}>
      <div className="container">
        <h5 className="o-subtitle">ONLINE COURSE</h5>
        <h2 className="o-title">ОНЛАЙН ХИЧЭЭЛ</h2>
        <div className="course-container">
          <div className="course-list">
            {levels.map(({ title, description, icon }, idx) => (
              <div className="course-item" key={idx}>
                <span className="icon">{icon}</span>
                <div>
                  <h6 className="course-title">{title}</h6>
                  <p className="course-desc">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => replace('/training')}>Дэлгэрэнгүй</Button>
        </div>
      </div>
    </div>
  );
};

export default OnlineCourse;
