import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ThemeProvider } from '@material-ui/core/styles';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { IntlProvider } from 'react-intl';

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
import theme, { backgroundColor } from './app/lib/theme';

// Components
import PersistedApolloProvider from './app/components/_core/PersistGateContainer/persist-gate.container';
import OfflineHydrator from './app/components/_core/OfflineHandler/offline-handler.container';

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
    <OfflineHydrator>
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en">
          <IonApp style={{ background: backgroundColor }}>
            <IonReactRouter>
              <Switch>
                {ROUTES}
              </Switch>
            </IonReactRouter>
          </IonApp>
        </IntlProvider>
      </ThemeProvider>
    </OfflineHydrator>
  </PersistedApolloProvider>
);

export default App;
