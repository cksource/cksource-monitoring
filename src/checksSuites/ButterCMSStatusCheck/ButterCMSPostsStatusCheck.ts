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

class ButterCMSPostsStatusCheck extends ButterCMSStatusCheck {
	public constructor(
	public checkDefinition: CheckDefinition
	) {
		super( checkDefinition );
	}

	public async run( metrics?: IMetrics ): Promise<void> {
		const timestamp: string = ( new Date() ).toISOString();
		const slug: string = `monitoring-${ timestamp.replaceAll( /:|\./g, '-' ).toLowerCase() }`;
		const title: string = `Tiugo Monitoring - ${ timestamp }`;
		const body: string = `<h1>New post from Tiugo monitoring</h1><p>${ timestamp }</p>`;
		const updatedBody: string = body.replace( 'New', 'Updated' );

		const createPostRequestOptions: RequestInit = {
			method: 'POST',
			body: JSON.stringify( {
				slug,
				title,
				body,
				author: { email: 'l.gudel@cksource.com' },
				status: 'published'
			} )
		};

		const updatePostRequestOptions: RequestInit = {
			method: 'PATCH',
			body: JSON.stringify( { body: updatedBody } )
		};

		const createPost: ButterCMSResponse = await this.sendRequest( '/v2/posts/', createPostRequestOptions );
		assert( createPost.status === 202, new RequestFailError( createPost ) );

		await this.delay( 1000 );

		const getPost: ButterCMSResponse<{data: {body: string;};}> = await this.sendRequest( `/v2/posts/${ slug }/` );
		assert( getPost.status === 200, new RequestFailError( getPost ) );
		assert( getPost.data.data.body === body, new ContentFailError( { ...getPost, expectedContent: body } ) );

		const updatePost: ButterCMSResponse = await this.sendRequest( `/v2/posts/${ slug }/`, updatePostRequestOptions );
		assert( updatePost.status <= 202, new RequestFailError( updatePost ) );

		await this.delay( 1000 );

		const getPostAfterUpdate: ButterCMSResponse<{data: {body: string;};}> = await this.sendRequest( `/v2/posts/${ slug }/` );
		assert( getPostAfterUpdate.status === 200, new RequestFailError( getPostAfterUpdate ) );
		assert(
			getPostAfterUpdate.data.data.body === updatedBody,
			new ContentFailError( { ...getPostAfterUpdate, expectedContent: updatedBody } )
		);

		const deletePost: ButterCMSResponse = await this.sendRequest( `/v2/posts/${ slug }/`, { method: 'DELETE' } );
		assert( deletePost.status === 204, new RequestFailError( deletePost ) );

		const getPostAfterDelete: ButterCMSResponse = await this.sendRequest( `/v2/posts/${ slug }/` );
		assert( getPostAfterDelete.status === 404, new RequestFailError( getPostAfterDelete ) );
	}
}

export default ButterCMSPostsStatusCheck;
