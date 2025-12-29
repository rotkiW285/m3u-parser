const m3uService = require('../services/m3uService');

async function routes(fastify, options) {
  
  fastify.get('/m3u', async (request, reply) => {
    try {
      const groupedData = await m3uService.getGroupedData();
      const groupList = groupedData['ALL_GROUPS_META_LIST'];
      return { groups: groupList };
    } catch (error) {
      reply.code(500).send({ error: 'Failed to retrieve data' });
    }
  });

  fastify.get('/m3u/:group', async (request, reply) => {
    try {
      const { group } = request.params;
      const groupedData = await m3uService.getGroupedData();
      
      const m3uContent = groupedData[group];
      
      if (!m3uContent) {
        reply.code(404).send({ error: 'Group not found' });
        return;
      }

      reply
        .header('Content-Type', 'application/x-mpegURL')
        .header('Content-Disposition', `attachment; filename="${group}.m3u"`)
        .send(m3uContent);

    } catch (error) {
      reply.code(500).send({ error: 'Failed to retrieve data' });
    }
  });
}

module.exports = routes;
