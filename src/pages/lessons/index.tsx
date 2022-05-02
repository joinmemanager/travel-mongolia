import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  const { replace } = useRouter();
  useEffect(() => {
    replace('/lessons/1');
  }, []);

  return (
    <Main meta={<Meta />}>
      <p className="mt-8 text-2xl text-center">redirecting....</p>
    </Main>
  );
};

export default Index;
