/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import URL from 'url';

import puppeteer, { Browser, Page } from 'puppeteer';

export default interface IEditorAgent {
    agentName: string;
    puppeteer: typeof puppeteer;
    browser: Browser;
    page: Page;

    launchAgent(): Promise<void>;
    setViewport( size: { width: number; height: number; } ): Promise<void>;
    visit( url: string ): Promise<void>;
    waitForEditor(): Promise<void>;
    focusEditor(): Promise<void>;
    type( text: string ): Promise<void>;
    selectContent( direction: string, offset: number ): Promise<void>;
    deleteContent(): Promise<void>;
    clickToolbarItem( buttonName: string ): Promise<void>;
 }

