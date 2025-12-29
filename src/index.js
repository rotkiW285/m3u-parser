const fastify = require('fastify')({ logger: true });
const config = require('./config');
const apiRoutes = require('./routes/api');

fastify.register(apiRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: config.PORT, host: '0.0.0.0' });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
