/* eslint-disable @next/next/no-img-element */
import React from 'react';
import {
  Button, Heading, Text, useColorMode,
} from 'theme-ui';
import $ from './header.module.scss';
import p from '../package.json';

const Header = function Header() {
  const [colorMode, setColorMode] = useColorMode();

  const nextColorModeText = colorMode === 'dark' ? 'Light' : 'Dark';
  const nextColorMode = colorMode === 'dark' ? 'light' : 'dark';
  const nextColorBgColor = colorMode === 'dark' ? '#eee' : '#111';
  const nextColorFgColor = colorMode === 'dark' ? '#000' : '#fff';

  return (
    <header>
      <div className={$.header}>
        <div className={$.logobox}>
          <img src="/holocore.svg" alt="HOLOCORE logo" />
          <Heading as="h1" className={$.title}>Roadshow</Heading>
          <Text className={$.version}>
            v
            {p.version}
          </Text>
        </div>
        <div className={$.controlbox}>
          <Button
            className={$.themebutton}
            sx={{
              bg: nextColorBgColor,
              color: nextColorFgColor,
            }}
            onClick={() => setColorMode(nextColorMode)}
          >
            {nextColorModeText}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
