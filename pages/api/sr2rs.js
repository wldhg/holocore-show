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
};

export default api;
