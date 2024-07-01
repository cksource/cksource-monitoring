/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { URL } from 'url';

import puppeteer, {
	Browser,
	Page,
	GoToOptions,
	KeyInput,
	KeyPressOptions
} from 'puppeteer';

import { Editor } from 'ckeditor5';

import IEditorAgent from './IEditorAgent';

class EditorAgent implements IEditorAgent {
	public agentName: string = 'editor-agent';

	public puppeteer: typeof puppeteer;

	public browser: Browser;

	public page: Page;

	private _url: string;

	private _editableSelector: string;

	private _editor: Editor | null;

	public async launchAgent(): Promise<void> {
		this.puppeteer = puppeteer;
		this.browser = await this.puppeteer.launch( { args: ['--no-sandbox', '--disable-setuid-sandbox'] } );
		this.page = await this.browser.newPage();

		console.log( 'EditorAgent initialized.' );
	}

	public async visit( url: string ): Promise<void> {
		this._url = url;

		const options: GoToOptions = {
			timeout: 15000,
			waitUntil: 'domcontentloaded'
		};

		console.log( `Visiting ${ this._url }` );
		await this.page.goto( this._url, options );
	}

	public async setViewport( size: { width: number; height: number; } ): Promise<void> {
		await this.page.setViewport( size );
	}

	public async waitForEditor(): Promise<void> {
		const parsedUrl: URL = new URL( this._url );
		const hash: string = parsedUrl.hash;
		const editableSelector: string = hash ? `#tab-${ hash } .ck-editor__editable_inline` : '.ck-editor__editable_inline';

		let editor: Editor | null = null;

		console.log( 'Waiting for the editor.' );

		await this.page.waitForSelector( editableSelector, { timeout: 10000 } );
		
		console.log( 'Editor initialized.' );

		this._editableSelector = editableSelector;
	}

	public async focusEditor(): Promise<void> {
		await this.page.focus( this._editableSelector );
	}

	public async type( text: string ): Promise<void> {
		await this.page.keyboard.type( text );
	}

	public async selectContent( direction: string, offset: number ): Promise<void> {
		let arrowKey: KeyInput = 'ArrowRight';

		if ( direction === ( 'Left' || 'left' ) ) {
			arrowKey = 'ArrowLeft';
		}

		const keyPressOptions: KeyPressOptions = { delay: 20 };

		await this.page.keyboard.down( 'Shift' );

		for ( let i: number = 0; i < offset; i++ ) {
			await this.page.keyboard.press( arrowKey, keyPressOptions );
		}
	}

	public async deleteContent(): Promise<void> {
		await this.page.keyboard.press( 'Backspace' );
	}

	public async clickToolbarItem( buttonName: string ): Promise<void> {
		await this.page.evaluate( () => {
			const toolbarElement: HTMLElement | null = globalThis.document.querySelector( '.ck-toolbar' );

			if ( !toolbarElement ) {
				return null;
			}

			const toolbarButtons: NodeListOf<HTMLButtonElement> = toolbarElement.querySelectorAll( '.ck-button' );

			const buttonToClick: HTMLButtonElement | undefined = Array.from( toolbarButtons ).find( ( element: HTMLElement ) =>
				element.dataset.ckeTooltipText ?
					element.dataset.ckeTooltipText.includes( buttonName ) :
					null );

			buttonToClick?.click();
		} );
	}
}

export default EditorAgent;
