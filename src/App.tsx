import * as React from 'react';
import { useState, useEffect } from 'react';

import AppMapper from './AppMapper';
import type { AppConfig, QueryParamsType } from './index.types';

import * as config from './config.json';

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

  if (!appState.config) {
    return null;
  }
  return <AppMapper {...appState.config} />;
};

export default App;
