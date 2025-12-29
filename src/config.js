require('dotenv').config();

module.exports = {
  SOURCE_URL: process.env.SOURCE_URL,
  CACHE_TTL: parseInt(process.env.CACHE_TTL) || 600,
  PORT: process.env.PORT || 3000
};
