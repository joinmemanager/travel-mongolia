import { Button } from 'components';
import BoxIcon from 'icons/colored/box.svg';
import CodeIcon from 'icons/colored/code.svg';
import GraphIcon from 'icons/colored/graph.svg';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const OnlinceCourseStyle = styled.div`
  background: #f6f8fd;
  padding: 66px 0;
  .o-subtitle {
    font-weight: 700;
    font-size: 16px;
    line-height: 1;
    color: #b9b9b9;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  .o-title {
    font-weight: 700;
    font-size: 24px;
    line-height: 1;
    color: #141414;
    margin-bottom: 33px;
    text-transform: uppercase;
  }
  .course-container {
    background-color: #ffffff;
    padding: 33px 52px 27px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 33px;
    .course-list {
      display: flex;
      justify-content: space-between;
      gap: 148px;

      .course-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        gap: 29px;

        span.icon {
          background: #1c182e;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
        }

        .course-title {
          font-weight: 700;
          font-size: 18px;
          line-height: 22px;
          color: #141414;
          margin-bottom: 11px;
        }

        .course-desc {
          font-weight: 500;
          font-size: 16px;
          line-height: 32px;
          color: #494949;
          margin-bottom: 0;
          min-height: 96px;
        }

        &:not(:last-of-type) {
          &:after {
            content: '';
            position: absolute;
            background-color: rgba(185, 185, 185, 0.6);
            width: 1px;
            height: 100%;
            right: -74px;
            top: 0;
          }
        }
      }
    }
  }
`;

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
    <OnlinceCourseStyle>
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
    </OnlinceCourseStyle>
  );
};

export default OnlineCourse;
