import moment from 'moment';
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const packageDefinition = loadSync(
  './proto/sr2rs.proto',
  {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);

const protoDescriptor = loadPackageDefinition(packageDefinition);

const client = new protoDescriptor.SRRSTelecomSpec(
  process.env.NEXT_PUBLIC_API_ENDPOINT || 'localhost:3324',
  credentials.createInsecure(),
);

const api = (I, O) => {
  O.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (I.headers['request-time'] && I.headers['request-time'] !== 'undefined') {
    const requestTime = moment(I.headers['request-time']);
    const now = moment();
    if (requestTime.isValid() && requestTime.isAfter(now.subtract(2, 'second'))) {
      return new Promise((resolve, _) => {
        let timedOut = false;
        const timer = setTimeout(() => {
          timedOut = true;
          O.end(JSON.stringify(
            {
              error: {
                code: '-1',
                details: 'gRPC timed out',
                metadata: {},
              },
            },
          ));
          resolve();
        }, 5000);
        client.subscribe({}, (err, response) => {
          if (!timedOut) {
            clearTimeout(timer);
            O.end(JSON.stringify(
              {
                error: err,
                data: response,
              },
            ));
            resolve();
          }
        });
      });
    }

    return new Promise((resolve, _) => {
      if (!requestTime.isValid()) {
        O.end(JSON.stringify(
          {
            error: {
              code: '-2',
              details: 'Request-Time header is invalid',
              metadata: {},
            },
          },
        ));
      } else {
        O.end(JSON.stringify(
          {
            error: {
              code: '-3',
              details: `Request-Time header is too past (${now - requestTime})`,
              metadata: {},
            },
          },
        ));
      }
      resolve();
    });
  }

  return new Promise((resolve, _) => {
    O.end(JSON.stringify(
      {
        error: {
          code: '-4',
          details: 'Request-Time header is missing',
          metadata: {},
        },
      },
    ));
    resolve();
  });
};

export default api;
