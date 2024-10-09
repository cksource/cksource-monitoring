/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable sort-class-members/sort-class-members */

import { ICheck } from '../Check.js';
import { ICheckDefinition } from '../CheckDefinition.js';
import SecretsManagerClient, { ISecretsManagerClient } from '../../common/SecretsManagerClient.js';

const secretsManagerClient: ISecretsManagerClient = SecretsManagerClient.getInstance();

abstract class ButterCMSStatusCheck implements ICheck {
	public checkName: string = 'buttercms_status';

	public constructor(
		public checkDefinition: ICheckDefinition
	) {}

	public abstract run(): void | Promise<void>;

	protected async sendRequest<T extends object>( path: string, options?: RequestInit ): Promise<{data: T; status: number;}> {
		const BUTTERCMS_API_KEY: string = await secretsManagerClient.getSecretValue( 'BUTTERCMS_API_KEY' );
		const BUTTERCMS_BASE_URL: string = await secretsManagerClient.getSecretValue( 'BUTTERCMS_BASE_URL' );

		const url: string = BUTTERCMS_BASE_URL + path;
		const res: Response = await fetch( url, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Token ${ BUTTERCMS_API_KEY }`
			}
		} );

		const resJson: T = res.headers.get( 'content-type' ) === 'application/json' ? await res.json() : {};

		return { data: resJson, status: res.status };
	}

	public waitUntil(
		callback: () => unknown,
		timeout: number = 5000,
		callbackRetryInterval: number = 500
	): Promise<void> {
		return new Promise( ( resolve: () => void, reject: ( error: Error ) => void ) => {
			let interval: NodeJS.Timeout;
			let returnedError: Error;

			// eslint-disable-next-line @typescript-eslint/typedef
			const watch = async (): Promise<void> => {
				try {
					await callback();
					clearInterval( interval );
					resolve();
				} catch ( error ) {
					returnedError = error;
				}
			};

			interval = setInterval( watch, callbackRetryInterval );

			setTimeout( () => {
				clearInterval( interval );
				reject(
					returnedError ??
					new Error( `The function execution did not complete within the specified timeout period of ${ timeout / 1000 } seconds` )
				);
			}, timeout );
		} );
	}
}

export default ButterCMSStatusCheck;
