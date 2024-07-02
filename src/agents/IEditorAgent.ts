/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import IAgent from './IAgent';

interface IEditorAgent extends IAgent {
    waitForEditor(): Promise<void>;
    focusEditor(): Promise<void>;
    type( text: string ): Promise<void>;
    selectContent( direction: string, offset: number ): Promise<void>;
    deleteContent(): Promise<void>;
    clickToolbarItem( buttonName: string ): Promise<void>;
 }

export default IEditorAgent;
