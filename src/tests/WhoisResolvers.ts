/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export const WhoisResolvers: { [key: string]: string; } = {
	// Main whois that should have link to next level whois service
	'tld': 'whois.iana.org',

	'com': 'whois.verisign-grs.com',
	'net': 'whois.verisign-grs.com',
	'org': 'whois.pir.org',

	// ccTLDs
	'ai': 'whois.nic.ai',
	'au': 'whois.auda.org.au',
	'bz': 'whois.identity.digital',
	'co': 'whois.nic.co',
	'ca': 'whois.cira.ca',
	'do': 'whois.nic.do',
	'eu': 'whois.eu',
	'gi': 'whois.identity.digital',
	'gl': 'whois.nic.gl',
	'in': 'whois.registry.in',
	'io': 'whois.nic.io',
	'it': 'whois.nic.it',
	'lc': 'whois.identity.digital',
	'me': 'whois.nic.me',
	'ro': 'whois.rotld.ro',
	'rs': 'whois.rnids.rs',
	'so': 'whois.nic.so',
	'tr': 'whois.nic.tr',
	'us': 'whois.nic.us',
	'vc': 'whois.identity.digital',
	'ws': 'whois.website.ws',

	'dev': 'whois.nic.google',
	'info': 'whois.nic.info',
	'link': 'whois.uniregistry.net',
	'live': 'whois.nic.live',
	'nyc': 'whois.nic.nyc',
	'one': 'whois.nic.one',
	'online': 'whois.nic.online',
	'shop': 'whois.nic.shop',
	'site': 'whois.nic.site',
	'xyz': 'whois.nic.xyz'
};
