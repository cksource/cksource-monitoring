/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import puppeteer, {
	Browser,
	Page,
	GoToOptions
} from 'puppeteer';

import IAgent from './IAgent';

class Agent implements IAgent {
	public agentName: string = 'agent';

	public puppeteer: typeof puppeteer;

	public browser: Browser;

	public page: Page;

	public url: string;

	public async launchAgent(): Promise<void> {
		this.puppeteer = puppeteer;
		this.browser = await this.puppeteer.launch( { args: [ '--no-sandbox', '--disable-setuid-sandbox' ] } );
		this.page = await this.browser.newPage();

		// eslint-disable-next-line no-console
		console.log( `${ this.agentName } initialized.` );
	}

	public async visit( address: string ): Promise<void> {
		this.url = address;

		const options: GoToOptions = {
			timeout: 15000,
			waitUntil: 'domcontentloaded'
		};

		// eslint-disable-next-line no-console
		console.log( `Visiting ${ this.url }` );

		await this.page.goto( this.url, options );
	}

	public async setViewport( size: { width: number; height: number; } ): Promise<void> {
		await this.page.setViewport( size );
	}
}

export default Agent;
