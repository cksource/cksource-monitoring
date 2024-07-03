/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import puppeteer, { Browser, Page } from 'puppeteer';

 interface IAgent {
     agentName: string;
     puppeteer: typeof puppeteer;
     browser: Browser;
     pages: { [ testId: number ]: Page; };

     launchAgent(): Promise<void>;
     stopAgent(): Promise<void>;
     openPage( testId: number ): Promise<Page>;
     closePage( testId: number ): Promise<void>;
     setViewport( testId: number, size: { width: number; height: number; } ): Promise<void>;
     visit( testId: number, url: string ): Promise<void>;
  }

export default IAgent;
