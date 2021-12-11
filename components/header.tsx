/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import {
  Button, Heading, Text, useColorMode,
} from 'theme-ui';
import axios from 'axios';

import $ from './header.module.scss';
import p from '../package.json';

type Props = {
  subtitle?: string;
};

const logics = (process.env.NEXT_PUBLIC_HO_LOGICS || 'local,holocore').split(',');

const Header = function Header(props: Props) {
  const [colorMode, setColorMode] = useColorMode();
  const [holoBtnStr, setHoloBtnStr] = useState('');
  const { subtitle } = props;

  const nextColorModeText = colorMode === 'dark' ? 'Light' : 'Dark';
  const nextColorMode = colorMode === 'dark' ? 'light' : 'dark';
  const nextColorBgColor = colorMode === 'dark' ? '#eee' : '#111';
  const nextColorFgColor = colorMode === 'dark' ? '#000' : '#fff';

  const sendReconnect = () => {
    axios.get('/api/sr2rs', {
      headers: {
        'Other-Command': 'reconnect',
      },
      timeout: 6000,
    }).then(() => {
      window.location.reload();
    }).catch(() => null);
  };

  const updateCHLogicButton = () => {
    axios.get('/api/sr2rs', {
      headers: {
        'Other-Command': 'getlogic',
      },
      timeout: 6000,
    }).then((res) => {
      const currIdx = logics.indexOf(res.data.data.currentLogic);
      let nextIdx = 0;
      if (currIdx === logics.length - 1) {
        nextIdx = 0;
      } else if (currIdx !== -1) {
        nextIdx = currIdx + 1;
      } else {
        nextIdx = 0;
      }
      setHoloBtnStr(logics[nextIdx]);
    }).catch(() => null);
  };
  updateCHLogicButton();

  const chLogic = () => {
    axios.get('/api/sr2rs', {
      headers: {
        'Other-Command': 'chlogic',
        'Other-Command-Arg': holoBtnStr,
      },
      timeout: 6000,
    }).then((res) => {
      setTimeout(updateCHLogicButton, 100);
    }).catch(() => null);
  };

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
          <Text className={$.subtitle}>
            {subtitle}
          </Text>
        </div>
        <div className={$.controlbox}>
          <Button
            className={$.themebutton}
            sx={{
              bg: nextColorBgColor,
              color: nextColorFgColor,
            }}
            onClick={chLogic}
            hidden={holoBtnStr === ''}
          >
            <span className={$.weak}>Change HO Logic To</span>
            &nbsp;
            <b>
              {holoBtnStr}
            </b>
            &nbsp;
            <span className={$.weak}>Mode</span>
          </Button>
          <Button
            className={$.themebutton}
            sx={{
              bg: nextColorBgColor,
              color: nextColorFgColor,
            }}
            onClick={sendReconnect}
          >
            Reconnect API
          </Button>
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

Header.defaultProps = {
  subtitle: '',
};

export default Header;
