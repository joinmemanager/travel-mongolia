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
    <div className="flex min-h-full flex-col justify-between">
      <div>
        <Header />
      </div>
      <div className="flex-1">{props.children}</div>
      <div>
        <Footer />
      </div>
    </div>
  </>
);

export { Main };
