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

	public pages: { [ testId: number ]: Page; };

	public constructor() {
		this.pages = {};
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
	}

	public async openPage( testId: number ): Promise<Page> {
		const page: Page = await this.browser.newPage();

		this.pages[ testId ] = page;

		return this.pages[ testId ];
	}

	public async closePage( testId: number ): Promise<void> {
		await this.pages[ testId ].close();
	}

	public async visit( testId: number, address: string ): Promise<void> {
		const options: GoToOptions = {
			timeout: 15000,
			waitUntil: 'domcontentloaded'
		};

		// eslint-disable-next-line no-console
		console.log( `Visiting ${ address }` );

		await this.pages[ testId ].goto( address, options );
	}

	public async setViewport( testId: number, size: { width: number; height: number; } ): Promise<void> {
		await this.pages[ testId ].setViewport( size );
	}
}

export default Agent;
