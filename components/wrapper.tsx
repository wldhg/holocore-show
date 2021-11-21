import React from 'react';
import Head from 'next/head';
import { Theme, ThemeProvider } from 'theme-ui';

const theme: Theme = {
  config: {
    initialColorModeName: 'light',
    useColorSchemeMediaQuery: true,
  },
  fonts: {
    body: '"Noto Sans", system-ui, sans-serif',
    heading: 'Overpass, sans-serif',
    monospace: '"Noto Sans Mono", monospace',
  },
  colors: {
    primary: '#91a8d0',
    text: '#000',
    background: '#fff',
    cella: 'gold',
    ueass: 'limegreen',
    unass: 'royalblue',
    assli: 'mediumseagreen',
    modes: {
      dark: {
        text: '#fff',
        background: '#060606',
        cella: 'gold',
        ueass: 'chartreuse',
        unass: 'cyan',
        assli: 'green',
      },
    },
  },
};

interface Props {
  thumbnailURL?: string
  className?: string | string[]
  children?: React.ReactElement | React.ReactElement[]
};

const Wrapper: React.FC<Props> = function Wrapper(props: Props) {
  const {
    children, thumbnailURL, className,
  } = props;

  const dispColor = '#91a8d0';
  const dispTitle = 'HOLOCORE ROADSHOW';
  const metaDescription = 'Hesitation is not a decision.';
  const metaImageDisp = typeof thumbnailURL === 'string' && thumbnailURL.length > 0;
  const fullClassName = [].concat(className).filter(Boolean).join(' ');
  const robots = 'noindex,nofollow';

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="theme-color" content={dispColor} />
        <meta name="robots" content={robots} />
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={dispTitle} />
        { metaImageDisp && <meta property="og:image" content={thumbnailURL} /> }
        <meta property="og:description" content={metaDescription} />
        <title>{dispTitle}</title>
        <link href="/favicon.png" rel="icon" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@400;700&family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Overpass:ital,wght@0,400;0,900;1,400;1,900&display=swap" rel="stylesheet" />
      </Head>
      <div className={fullClassName}>{children}</div>
    </ThemeProvider>
  );
};

Wrapper.defaultProps = {
  thumbnailURL: null,
  className: '',
  children: undefined,
};

export default Wrapper;
