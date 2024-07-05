/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */
import { URL } from 'url';

import { ITest } from '../Test';

import Agent from '../../agents/Agent';
import EditorAgent from '../../agents/EditorAgent';

import { DemoFailError } from '../../errors/DemoFailError';

class EditorDemoTest implements ITest {
	public productName: string;

	public testName: string = 'editor-demo';

	public constructor( private readonly _agent: Agent, private readonly _address: string ) {
		const parsedUrl: URL = new URL( this._address );

		this.productName = parsedUrl.pathname + parsedUrl.hash;
	}

	public async run(): Promise<void> {
		const agent: Agent = this._agent;

		const editorAgent: EditorAgent = new EditorAgent( agent );

		try {
			await editorAgent.visit( this._address );
			await editorAgent.waitForEditor();
			await editorAgent.closePage();
		} catch ( error ) {
			throw new DemoFailError( this.productName, 'Demo is down.' );
		}
	}
}

export default EditorDemoTest;
