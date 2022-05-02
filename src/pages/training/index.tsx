import { Card, Container } from 'components';

import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

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
      </div>
      <div className="payment-summary">
        <h1 className="section-title">Төлбөрийн мэдээлэл</h1>
        <Card>aa</Card>
      </div>
    </Container>
  </Main>
);

export default Training;
