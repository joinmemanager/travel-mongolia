import { ReactNode } from 'react';
import styled from 'styled-components';

import Footer from '@/layout/Footer';
import Header from '@/layout/Header';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const MainWrapper = styled.div`
  .main-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;

    .body-section {
      flex: 1;
    }
  }
`;

const Main = (props: IMainProps) => (
  <MainWrapper>
    <div className="meta">{props.meta}</div>
    <div className="main-wrapper">
      <div className="header-section">
        <Header />
      </div>
      <div className="body-section">{props.children}</div>
      <div className="footer-section">
        <Footer />
      </div>
    </div>
  </MainWrapper>
);

export { Main };
