import React from 'react';
import { Switch } from 'react-router-dom';
import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { IntlProvider } from 'react-intl';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';
import './theme/global.css';
import theme, { color } from './app/lib/_theme';

// Components
import PersistedApolloProvider from './app/domains/_core/PersistGateContainer/persist-gate.container';
import OfflineHydrator from './app/domains/_core/OfflineHandler/offline-handler.container';
import { ROUTES } from './_routes';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

if (process.env.REACT_APP_SENTRY_ENV && process.env.REACT_APP_SENTRY_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY,
    environment: process.env.REACT_APP_SENTRY_ENV,
    integrations: [
      new Integrations.BrowserTracing()
    ],
    tracesSampleRate: process.env.REACT_APP_SENTRY_ENV === 'production' ? 0.1 : 1.0
  });
}

const App: React.FC = () => (
  <PersistedApolloProvider>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <OfflineHydrator>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <IntlProvider locale="en">
              <IonApp style={{ background: color.background.main }}>
                <IonReactRouter>
                  <Switch>
                    {ROUTES}
                  </Switch>
                </IonReactRouter>
              </IonApp>
            </IntlProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </OfflineHydrator>
    </LocalizationProvider>
  </PersistedApolloProvider>
);

export default App;
