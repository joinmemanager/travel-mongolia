// import { useRouter } from 'next/router';

import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  // const router = useRouter();

  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium
      doloremque dolorum eius esse exercitationem inventore maiores molestias
      necessitatibus pariatur placeat, porro quae quasi qui veritatis,
      voluptatem. Est quisquam quo saepe!
    </Main>
  );
};

export default Index;
