/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable @typescript-eslint/padding-line-between-statements */

import assert from 'node:assert/strict';

import ButterCMSStatusCheck from './ButterCMSStatusCheck.js';
import { CheckDefinition } from '../CheckDefinition.js';
import { IMetrics } from '../../common/Metrics.js';

import { ContentFailError } from '../../errors/ContentFailError.js';
import { RequestFailError } from '../../errors/RequestFailError.js';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type ButterCMSResponse<T = unknown> = {
	data: T;
	status: number;
}

interface ICollectionItem {
	meta: {id: string;};
	title: string;
	date: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type GetCollectionItemsData = {
		data: {
			'monitoring-collection': ICollectionItem[];
		};
}

class ButterCMSCollectionsStatusCheck extends ButterCMSStatusCheck {
	public constructor(
	public checkDefinition: CheckDefinition
	) {
		super( checkDefinition );
	}

	public async run( metrics?: IMetrics ): Promise<void> {
		const timestamp: string = ( new Date() ).toISOString();
		// eslint-disable-next-line @typescript-eslint/typedef
		const slug = 'monitoring-collection';
		const expectedTitle: string = `Tiugo Monitoring - ${ timestamp }`;
		// const body: string = `<h1>New post from Tiugo monitoring</h1><p>${ timestamp }</p>`;
		// const updatedBody: string = body.replace( 'New', 'Updated' );

		const createCollectionItemRequestOptions: RequestInit = {
			method: 'POST',
			body: JSON.stringify( {
				key: slug,
				status: 'published',
				fields: [
					{ title: expectedTitle, date: timestamp }
				]
			} )
		};

		const createCollectionItem: ButterCMSResponse = await this.sendRequest( '/v2/content/', createCollectionItemRequestOptions );
		assert( createCollectionItem.status === 202, new RequestFailError( createCollectionItem ) );

		await this.delay( 1000 );

		const getCollectionItems: ButterCMSResponse<GetCollectionItemsData> = await this.sendRequest( `/v2/content/${ slug }/` );
		assert( getCollectionItems.status === 200, new RequestFailError( getCollectionItems ) );

		const createdItem: ICollectionItem[] = ( getCollectionItems.data.data[ slug ] as ICollectionItem[] ).filter(
			( item: ICollectionItem ) => item.title === expectedTitle
		);
		assert(
			createdItem.length !== 0,
			new ContentFailError( { ...getCollectionItems, createdItem, expectedItemTitle: expectedTitle } )
		);

		const deleteCollectionItem: ButterCMSResponse = await this.sendRequest(
			`/v2/content/${ slug }/${ createdItem[ 0 ].meta.id }`,
			{ method: 'DELETE' }
		);
		assert( deleteCollectionItem.status === 204, new RequestFailError( deleteCollectionItem ) );

		const getCollectionAfterDelete: ButterCMSResponse = await this.sendRequest( `/v2/content/${ slug }/` );
		assert( getCollectionAfterDelete.status === 200, new RequestFailError( getCollectionAfterDelete ) );
		const createdItemAfterDelete: ICollectionItem[] = ( getCollectionItems.data.data[ slug ] as ICollectionItem[] ).filter(
			( item: ICollectionItem ) => item.title === expectedTitle
		);
		assert(
			createdItemAfterDelete.length !== 0,
			new ContentFailError( { ...getCollectionAfterDelete, createdItemAfterDelete, NotExpectedItemTitle: expectedTitle } )
		);
		//
	}
}

export default ButterCMSCollectionsStatusCheck;
