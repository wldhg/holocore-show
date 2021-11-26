import React from 'react';
import dynamic from 'next/dynamic';
import Wrapper from 'components/wrapper';
import Header from 'components/header';

const App = function App() {
  const Map = dynamic(
    () => import('components/mappoint'),
    { ssr: false },
  );

  return (
    <Wrapper>
      <Header subtitle="Lat/Lng Display Tool" />
      <Map />
    </Wrapper>
  );
};

export default App;
