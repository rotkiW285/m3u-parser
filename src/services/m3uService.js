const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config');

const m3uCache = new NodeCache({ stdTTL: config.CACHE_TTL, checkperiod: 120 });
const CACHE_KEY = 'm3u_data';

class M3uService {

  async getGroupedData() {
    const cachedData = m3uCache.get(CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }

    console.log('Cache miss or expired. Fetching from source...');
    try {
      const response = await axios.get(config.SOURCE_URL);
      const rawData = response.data;

      const parsedGroups = this.parseM3u(rawData);

      m3uCache.set(CACHE_KEY, parsedGroups);
      return parsedGroups;
    } catch (error) {
      console.error('Error fetching M3U:', error.message);
      throw new Error('Failed to fetch M3U source');
    }
  }

  parseM3u(rawData) {
    const lines = rawData.split('\n');
    const groups = {};
    const ALL_GROUPS_KEY = 'ALL_GROUPS_META_LIST';

    let currentInf = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      if (line.startsWith('#EXTINF:')) {
        currentInf = line;
      } else if (line.startsWith('#') && !line.startsWith('#EXTINF:')) {
        continue;
      } else {
        if (currentInf) {
          const groupName = this.extractGroup(currentInf);

          if (groupName) {
            if (!groups[groupName]) {
              groups[groupName] = [];
            }
            groups[groupName].push({ inf: currentInf, url: line });
          }

          currentInf = null;
        }
      }
    }

    const result = {};
    const groupList = Object.keys(groups).sort();

    groupList.forEach(group => {
      const header = '#EXTM3U\n';
      const body = groups[group].map(item => `${item.inf}\n${item.url}`).join('\n');
      result[group] = header + body;
    });

    result[ALL_GROUPS_KEY] = groupList;

    return result;
  }

  extractGroup(extInfLine) {
    // Regex to match: tvg-name="([^"]+)"
    const match = extInfLine.match(/tvg-name="([^"]+)"/);
    if (match && match[1]) {
      const nameValue = match[1];
      const parts = nameValue.split(':');
      if (parts.length > 1) {
        return parts[0].trim();
      }
    }
    return null;
  }
}

module.exports = new M3uService();
