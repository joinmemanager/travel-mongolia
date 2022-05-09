import { Button, Card, Container } from 'components';
import GolomtIcon from 'icons/bank/golomt.svg';
import DownloadIcon from 'icons/download.svg';
import StarIcon from 'icons/star.svg';

import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

import DepositMethod from './_common/DepositMethod';
import MethodButton from './_common/MethodButton';
import styles from './training.module.less';

const Training = () => (
  <Main meta={<Meta />}>
    <Container className={styles.training}>
      <div className="training-content">
        <h1 className="section-title">Сургалтын агуулга</h1>
        <Card>
          <h1 className="main-title">
            Манай Онлайн сургалтын төв нь үндсэн 4 хэсгээс бүрдэнэ.
          </h1>
          <hr />
        </Card>
        <h1 className="section-title">Та манай сургалтанд хамрагдсанаар:</h1>
        <Card>
          <h1 className="main-title">Цахим хуудсанд байрлах үндсэн хичээл</h1>
          <hr />
        </Card>
      </div>
      <div className="payment-summary">
        <h1 className="section-title">Төлбөрийн мэдээлэл</h1>
        <Card>
          <div className="course-shorty">
            <span className="icon">
              <StarIcon />
            </span>
            <p className="short-desc">
              Нийт 2 сарын онол + 1 сарын дадлага хосолсон сургалт юм.
            </p>
          </div>
          <div className="flex justify-between align-middle total">
            <span className="label">Нийт төлбөр</span>
            <span className="price">249$</span>
          </div>
          <div className="methods">
            <MethodButton icon={<GolomtIcon />} label="Голомт банкаар" />
            <DepositMethod />
          </div>
          <div className="actions">
            <Button type="secondary" block>
              <DownloadIcon /> PDF танилцуулга татах
            </Button>
            <Button block>Төлбөр төлөх</Button>
          </div>
        </Card>
      </div>
    </Container>
  </Main>
);

export default Training;
