/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { URL } from 'url';

import {
	KeyInput,
	KeyPressOptions,
	Page
} from 'puppeteer';

import Agent from './Agent';
import IAgent from './IAgent';
import IEditorAgent from './IEditorAgent';

class EditorAgent extends Agent implements IEditorAgent {
	public agentName: string = 'EditorAgent';

	private _editableSelector: string;

	public page: Page;

	public constructor( private readonly _agent: IAgent, private readonly _testId: number ) {
		super();

		this._agent = _agent;
	}

	public async waitForEditor(): Promise<void> {
		const url: string = this.page.url();

		const parsedUrl: URL = new URL( url );
		const hash: string = parsedUrl.hash;
		const editableSelector: string = hash ?
			`#tab-${ hash.replace( '#', '' ) } .ck-editor__editable_inline` :
			'.ck-editor__editable_inline';

		// eslint-disable-next-line no-console
		console.log( `${ parsedUrl.pathname + hash } - Waiting for the editor.` );

		await this.page.waitForSelector( editableSelector, { timeout: 15000 } );

		// eslint-disable-next-line no-console
		console.log( `${ parsedUrl.pathname + hash } - Editor initialized.` );

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

	public async setupAgent(): Promise<void> {
		await this._agent.openPage( this._testId );

		this.page = this._agent.pages[ this._testId ];
	}

	public async visitPage( address: string ): Promise<void> {
		await this._agent.visit( this._testId, address );
	}

	public async closePage(): Promise<void> {
		await this._agent.closePage( this._testId );
	}
}

export default EditorAgent;
