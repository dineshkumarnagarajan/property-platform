export function sanitiseString(value: string): string {
    return value.trim().replace(/<[^>]*>/g, '');
}

export function sanitiseEnquiry(body: any) {
    return {
        name: sanitiseString(body.name || ''),
        email: sanitiseString(body.email || '').toLowerCase(),
        phone: sanitiseString(body.phone || ''),
        message: sanitiseString(body.message || ''),
        property_id: sanitiseString(body.property_id || ''),
    };
}