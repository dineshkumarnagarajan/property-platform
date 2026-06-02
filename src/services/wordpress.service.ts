import { request, gql } from 'graphql-request';
import { cacheManager } from '../cache/cacheManager';
import { CACHE_KEYS, TTL } from '../cache/keys';
import { config } from '../config';
import { logger } from '../utils/logger';

const PROPERTIES_QUERY = gql`
  query GetProperties($first: Int!, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      edges {
        node {
          id
          title
          content
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const wordpressService = {

    getProperties: async (page: number) => {
        const cacheKey = CACHE_KEYS.WP_PROPERTIES(page);
        const cached = await cacheManager.get(cacheKey);
        if (cached) {
            logger.info(`WP cache hit: page ${page}`);
            return cached;
        }

        try {
            const data = await request(
                config.wp.graphqlUrl,
                PROPERTIES_QUERY,
                { first: 10, after: null }
            );

            await cacheManager.set(cacheKey, data, TTL.WP_PROPERTIES);
            logger.info(`WP fetched: page ${page}`);
            return data;
        } catch (err) {
            logger.error('WP fetch failed:', err);
            throw new Error('Failed to fetch properties');
        }
    },

    invalidateCache: async () => {
        await cacheManager.deleteByPattern('wp:properties:*');
        logger.info('WP cache invalidated');
    },
};