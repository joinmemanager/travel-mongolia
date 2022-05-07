// import { useRouter } from 'next/router';

import { Meta } from '@/layout/Meta';
import Heatmap from '@/partials/home/Heatmap';
import MainBanner from '@/partials/home/MainBanner';
import News from '@/partials/home/News';
import OnlineCourse from '@/partials/home/OnlineCourse';
import OurVision from '@/partials/home/OurVision';
import Partners from '@/partials/home/Partners';
import Stats from '@/partials/home/Stats';
import { Main } from '@/templates/Main';

const Index = () => {
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
      <News />
      <Partners />
      <Heatmap />
    </Main>
  );
};

export default Index;
