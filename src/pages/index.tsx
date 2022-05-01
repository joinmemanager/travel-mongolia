// import { useRouter } from 'next/router';

import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  // const router = useRouter();

  return (
    <Main
      meta={
        <Meta title="Teslatraders" description="Everything about trading" />
      }
    >
      <div style={{ height: 577, backgroundColor: '#1C182E' }}></div>
    </Main>
  );
};

export default Index;
