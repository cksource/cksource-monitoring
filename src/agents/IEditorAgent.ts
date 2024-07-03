/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import IAgent from './IAgent';

interface IEditorAgent extends IAgent {
    waitForEditor( testId: number ): Promise<void>;
    focusEditor( testId: number ): Promise<void>;
    type( testId: number, text: string ): Promise<void>;
    selectContent( testId: number, direction: string, offset: number ): Promise<void>;
    deleteContent( testId: number ): Promise<void>;
    clickToolbarItem( testId: number, buttonName: string ): Promise<void>;
 }

export default IEditorAgent;
