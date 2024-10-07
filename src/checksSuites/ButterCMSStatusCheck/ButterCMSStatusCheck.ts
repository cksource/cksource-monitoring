/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable sort-class-members/sort-class-members */

import { SecretsManager } from '@aws-sdk/client-secrets-manager';

import { ICheck } from '../Check.js';
import { ICheckDefinition } from '../CheckDefinition.js';
import { IMetrics } from '../../common/Metrics.js';

const secretsCache: {BUTTERCMS_API_KEY: string;} = { BUTTERCMS_API_KEY: '' };
const BUTTERCMS_API_KEY: string = await _getButterCMSApiKey() ?? '';
const BUTTERCMS_BASE_URL: string = process.env.BUTTERCMS_BASE_URL ?? '';

abstract class ButterCMSStatusCheck implements ICheck {
	public abstract readonly checkName: string;

	public constructor(
		public checkDefinition: ICheckDefinition
	) {}

	public abstract run( metrics?: IMetrics ): void | Promise<void>;

	protected async sendRequest<T extends object>( path: string, options?: RequestInit ): Promise<{data: T; status: number;}> {
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

	protected delay( delayInMs: number ): Promise<void> {
		return new Promise( resolve => setTimeout( resolve, delayInMs ) );
	}
}

export default ButterCMSStatusCheck;

async function _getButterCMSApiKey(): Promise<string> {
	// eslint-disable-next-line @typescript-eslint/typedef
	const secretName = 'BUTTERCMS_API_KEY';

	if ( process.env[ secretName ] ) {
		return process.env[ secretName ];
	}

	if ( secretsCache[ secretName ] ) {
		return secretsCache[ secretName ];
	}

	const sm: SecretsManager = new SecretsManager();

	const { SecretString: secret } = await sm.getSecretValue( {
		SecretId: process.env[ `${ secretName }_ID` ]
	} );

	if ( !secret ) {
		throw new Error( `${ secretName } value is missing.` );
	}

	secretsCache[ secretName ] = secret;

	return secret;
}
