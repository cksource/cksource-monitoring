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

	public async waitForEditor( testId: number ): Promise<void> {
		const url: string = this.pages[ testId ].url();

		const parsedUrl: URL = new URL( url );
		const hash: string = parsedUrl.hash;
		const editableSelector: string = hash ?
			`#tab-${ hash.replace( '#', '' ) } .ck-editor__editable_inline` :
			'.ck-editor__editable_inline';

		// eslint-disable-next-line no-console
		console.log( `${ parsedUrl.pathname + hash } - Waiting for the editor.` );

		await this.pages[ testId ].waitForSelector( editableSelector, { timeout: 15000 } );

		// eslint-disable-next-line no-console
		console.log( `${ parsedUrl.pathname + hash } - Editor initialized.` );

		this._editableSelector = editableSelector;
	}

	public async focusEditor( testId: number ): Promise<void> {
		await this.pages[ testId ].focus( this._editableSelector );
	}

	public async type( testId: number, text: string ): Promise<void> {
		await this.pages[ testId ].keyboard.type( text );
	}

	public async selectContent( testId: number, direction: string, offset: number ): Promise<void> {
		let arrowKey: KeyInput = 'ArrowRight';

		if ( direction === ( 'Left' || 'left' ) ) {
			arrowKey = 'ArrowLeft';
		}

		const keyPressOptions: KeyPressOptions = { delay: 20 };

		await this.pages[ testId ].keyboard.down( 'Shift' );

		for ( let i: number = 0; i < offset; i++ ) {
			await this.pages[ testId ].keyboard.press( arrowKey, keyPressOptions );
		}
	}

	public async deleteContent( testId: number ): Promise<void> {
		await this.pages[ testId ].keyboard.press( 'Backspace' );
	}

	public async clickToolbarItem( testId: number, buttonName: string ): Promise<void> {
		await this.pages[ testId ].evaluate( () => {
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
