import React from 'react';
import dynamic from 'next/dynamic';
import Wrapper from 'components/wrapper';
import Header from 'components/header';

const App = function App() {
  const Map = dynamic(
    () => import('components/map'),
    { ssr: false },
  );

  return (
    <Wrapper>
      <Header />
      <Map />
    </Wrapper>
  );
};

export default App;
