/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { URL } from 'url';

import {
	KeyInput,
	KeyPressOptions
} from 'puppeteer';

import Agent from './Agent';
import IEditorAgent from './IEditorAgent';

class EditorAgent extends Agent implements IEditorAgent {
	public agentName: string = 'EditorAgent';

	private _editableSelector: string;

	public async waitForEditor(): Promise<void> {
		const parsedUrl: URL = new URL( this.url );
		const hash: string = parsedUrl.hash;
		const editableSelector: string = hash ? `#tab-${ hash } .ck-editor__editable_inline` : '.ck-editor__editable_inline';

		// eslint-disable-next-line no-console
		console.log( 'Waiting for the editor.' );

		await this.page.waitForSelector( editableSelector, { timeout: 10000 } );

		// eslint-disable-next-line no-console
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
