/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import puppeteer, {
	Browser,
	Page,
	GoToOptions
} from 'puppeteer';

class Agent {
	public agentName: string = 'agent';

	public puppeteer: typeof puppeteer;

	public browser: Browser;

	public pages: Map<string, Page>;

	public constructor() {
		this.pages = new Map<string, Page>();
	}

	public async launchAgent(): Promise<void> {
		this.puppeteer = puppeteer;
		this.browser = await this.puppeteer.launch( { args: [ '--no-sandbox', '--disable-setuid-sandbox' ] } );

		// eslint-disable-next-line no-console
		console.log( `${ this.agentName } initialized.` );
	}

	public async stopAgent(): Promise<void> {
		for ( const page of await this.browser.pages() ) {
			await page.close();
		}

		await this.browser.close();
	}

	public async closePage( url: string ): Promise<void> {
		await this.pages.get( url )!.close();
	}

	public async visit( url: string ): Promise<void> {
		await this._openPage( url );

		const options: GoToOptions = {
			timeout: 15000,
			waitUntil: 'domcontentloaded'
		};

		// eslint-disable-next-line no-console
		console.log( `Visiting ${ url }` );

		await this.pages.get( url )!.goto( url, options );
	}

	public async setViewport( url: string, size: { width: number; height: number; } ): Promise<void> {
		await this.pages.get( url )!.setViewport( size );
	}

	private async _openPage( url: string ): Promise<void> {
		const page: Page = await this.browser.newPage();

		this.pages.set( url, page );
	}
}

export default Agent;
