export const CACHE_KEYS = {
    ENQUIRY: (id: string) => `enquiry:${id}`,
    ENQUIRY_LIST: (page: number) => `enquiry:list:${page}`,
    WP_PROPERTIES: (page: number) => `wp:properties:${page}`,
    WP_PROPERTY: (id: string) => `wp:property:${id}`,
};

export const TTL = {
    ENQUIRY: 60,
    ENQUIRY_LIST: 30,
    WP_PROPERTIES: 300,
    WP_PROPERTY: 300,
};