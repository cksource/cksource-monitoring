/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import puppeteer, { Browser, Page } from 'puppeteer';

 interface IAgent {
     agentName: string;
     puppeteer: typeof puppeteer;
     browser: Browser;
     page: Page;

     launchAgent(): Promise<void>;
     setViewport( size: { width: number; height: number; } ): Promise<void>;
     visit( url: string ): Promise<void>;
  }

export default IAgent;
