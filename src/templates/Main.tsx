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
    <div className="flex flex-col justify-between min-h-full">
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
