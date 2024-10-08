/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable @typescript-eslint/padding-line-between-statements */

import assert from 'node:assert/strict';

import ButterCMSStatusCheck from './ButterCMSStatusCheck.js';
import { CheckDefinition } from '../CheckDefinition.js';

import { ContentFailError } from '../../errors/ContentFailError.js';
import { RequestFailError } from '../../errors/RequestFailError.js';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type ButterCMSResponse<T = unknown> = {
	data: T;
	status: number;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type GetPageData = {
	data: {
		name: string;
		fields: {
			title: string;
			description: string;
			date: string;
		};
	};
}

class ButterCMSPagesStatusCheck extends ButterCMSStatusCheck {
	public constructor() {
		super( new CheckDefinition( {
			organization: 'ButterCMS',
			productGroup: 'apis',
			productName: 'pages'
		} ) );
	}

	public async run(): Promise<void> {
		const timestamp: string = ( new Date() ).toISOString();
		const path: string = '/v2/pages/test-page/tiugo-monitoring-page/';
		const expectedTitle: string = 'Tiugo Monitoring page';

		const updatePageRequestOptions: RequestInit = {
			method: 'PATCH',
			body: JSON.stringify( {
				fields: {
					description: timestamp
				},
				status: 'published'
			} )
		};

		const getPage: ButterCMSResponse<GetPageData> = await this.sendRequest( path );
		assert( getPage.status === 200, new RequestFailError( getPage ) );
		assert( getPage?.data?.data?.name === expectedTitle, new ContentFailError( { ...getPage, expectedName: expectedTitle } ) );

		const updatePage: ButterCMSResponse = await this.sendRequest( path, updatePageRequestOptions );
		assert( updatePage.status === 202, new RequestFailError( updatePage ) );

		await this.waitUntil(
			async () => {
				const getPageAfterUpdate: ButterCMSResponse<GetPageData> = await this.sendRequest( path );
				assert( getPageAfterUpdate.status === 200, new RequestFailError( getPageAfterUpdate ) );
				assert(
					getPageAfterUpdate?.data?.data?.fields?.description === timestamp,
					new ContentFailError( { ...getPageAfterUpdate, expectedDescription: timestamp } )
				);
			}
		);
	}
}

export default ButterCMSPagesStatusCheck;
