import { loadPackageDefinition, credentials, getClientChannel } from '@grpc/grpc-js';
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

let client = null;

const initClient = () => {
  if (client != null) {
    getClientChannel(client).close();
    client = null;
  }
  client = new protoDescriptor.SRRSTelecomSpec(
    process.env.NEXT_PUBLIC_API_ENDPOINT || 'localhost:3324',
    credentials.createInsecure(),
  );
  // eslint-disable-next-line no-console
  console.log('API - Reconnect request proceeded.');
};

initClient();

const api = (I, O) => {
  O.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (
    client == null
    || (I.headers['other-command'] && I.headers['other-command'] === 'reconnect')
  ) {
    initClient();
  }
  if (I.headers['other-command'] && I.headers['other-command'] === 'chlogic') {
    const newLogic = I.headers['other-command-arg'] || 'local';
    client.ChangeHOLogic({
      newLogic,
    }, (err, res) => {});
  }
  if (I.headers['other-command'] && I.headers['other-command'] === 'getlogic') {
    return new Promise((resolve, _) => {
      client.CurrentHOLogic({}, (err, res) => {
        resolve();
        O.end(JSON.stringify({
          error: err,
          data: res,
        }));
      });
    });
  }
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
    }, 3000);
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
};

export default api;
