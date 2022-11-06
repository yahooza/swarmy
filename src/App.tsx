import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';

import AppMapper from './AppMapper';
import type { AppConfig, QueryParamsType } from './AppTypes';

import * as config from './config.json';

// TODO: Local Storage
//   * token

const App = ({ queryParams }: { queryParams: QueryParamsType }) => {
  const [appState, setAppState] = useState<{
    config: AppConfig;
    queryParams: QueryParamsType;
  }>({
    config: undefined,
    queryParams: undefined
  });

  useEffect(() => {
    setAppState({ config, queryParams });
  }, [config, queryParams]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateConfig = useCallback(
    (key: string, value: string) => {
      setAppState((prevState) => {
        return {
          ...prevState,
          config: {
            ...prevState.config,
            [key]: value
          }
        };
      });
    },
    [config]
  );

  if (!appState.config) {
    return null;
  }
  return <AppMapper {...appState.config} />;
};

export default App;
