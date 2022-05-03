// import { useRouter } from 'next/router';

import { Meta } from '@/layout/Meta';
import MainBanner from '@/partials/home/MainBanner';
import OnlineCourse from '@/partials/home/OnlineCourse';
import OurVision from '@/partials/home/OurVision';
import Stats from '@/partials/home/Stats';
import { Main } from '@/templates/Main';

const Index = () => {
  // const router = useRouter();

  return (
    <Main
      meta={
        <Meta title="Teslatraders" description="Everything about trading" />
      }
    >
      <MainBanner />
      <OnlineCourse />
      <OurVision />
      <Stats />
    </Main>
  );
};

export default Index;
