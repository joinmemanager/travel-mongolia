import { ReactNode } from 'react';

import Footer from '@/layout/Footer';
import Header from '@/layout/Header';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <>
    <div className="meta">{props.meta}</div>
    <Header />
    <div className="body">{props.children}</div>
    <Footer />
  </>
);

export { Main };
