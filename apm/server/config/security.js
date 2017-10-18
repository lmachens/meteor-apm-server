import helmet from 'helmet';

// added HSTS headers
WebApp.connectHandlers.use(
  helmet.hsts({
    maxAge: 1000 * 3600 * 24 * 30, // 30 days,
    includeSubdomains: false
  })
);

// added iexss
WebApp.connectHandlers.use(helmet.xssFilter());

// stop clickjacking
WebApp.connectHandlers.use(helmet.frameguard());
