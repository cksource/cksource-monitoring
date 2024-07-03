/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */
import { URL } from 'url';

import { ITest } from '../Test';

import EditorAgent from '../../agents/EditorAgent';

import IAgent from '../../agents/IAgent';
import IEditorAgent from '../../agents/IEditorAgent';

import { DemoFailError } from '../../errors/DemoFailError';

class EditorDemoTest implements ITest {
	public productName: string;

	public testName: string = 'editor-demo';

	public constructor( private readonly _agent: IAgent, private readonly _address: string, private readonly _testId: number ) {
		const parsedUrl: URL = new URL( this._address );

		this.productName = parsedUrl.pathname + parsedUrl.hash;
	}

	public async run(): Promise<void> {
		const agent: IAgent = this._agent;

		const editorAgent: IEditorAgent = new EditorAgent( agent, this._testId );

		try {
			await editorAgent.setupAgent();

			await editorAgent.visitPage( this._address );
			await editorAgent.waitForEditor();
			await editorAgent.closePage();
		} catch ( error ) {
			throw new DemoFailError( this.productName, 'Demo is down.' );
		}
	}
}

export default EditorDemoTest;
