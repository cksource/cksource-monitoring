/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import URL from 'url';

import {
	PuppeteerNode,
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

	public puppeteer: PuppeteerNode;

	public browser: Browser;

	public page: Page;

	private _url: URL;

	private _editableSelector: string;

	private _editor: Editor | null;

	public async launchAgent(): Promise<void> {
		this.puppeteer = new PuppeteerNode();
		this.browser = await this.puppeteer.launch();
		this.page = await this.browser.newPage();
	}

	public async visit( url: URL ): Promise<void> {
		this._url = url;

		const options: GoToOptions = {
			timeout: 15000,
			waitUntil: 'domcontentloaded'
		};

		await this.page.goto( this._url.href, options );
	}

	public async setViewport( size: { width: number; height: number; } ): Promise<void> {
		await this.page.setViewport( size );
	}

	public async waitForEditor(): Promise<void> {
		const hash: string = this._url.hash;
		const editableSelector: string = hash ? `#tab-${ hash } .ck-editor__editable_inline` : '.ck-editor__editable_inline';

		let editor: Editor | null = null;

		await this.page.evaluate( () => new Promise( ( resolve, reject ) => {
			let counter: number = 1;

			const getEditorState = (): string | undefined => {
				const document: Document = globalThis.document;
				const editableElement: HTMLElement & { ckeditorInstance?: Editor; } = document.querySelector( editableSelector )!;

				editor = editableElement.ckeditorInstance!;

				return editor?.state;
			};

			const editorStateChecker: ReturnType<typeof setInterval> = setInterval( () => {
				const editorState: string | undefined = getEditorState();

				if ( editorState && editorState === 'ready' ) {
					clearInterval( editorStateChecker );
					resolve( 'initialized' );
				}

				counter++;
			}, 1000 );

			if ( counter === 10 ) {
				clearInterval( editorStateChecker );
				reject( 'initialization error' );
			}
		} ) );

		this._editableSelector = editableSelector;
		this._editor = editor;
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
