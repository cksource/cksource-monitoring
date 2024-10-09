/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */
import {
	GetSecretValueCommand,
	GetSecretValueCommandOutput,
	SecretsManagerClient as AWSSecretsManagerClient
} from '@aws-sdk/client-secrets-manager';

export interface ISecretsManagerClient {
	getSecretValue( secretName: string ): Promise<string>;
}

export interface ICacheRecord {
	value: string;
	expirationTime: number;
}

const DEFAULT_TTL: number = 3600000; // 1 hour

export default class SecretsManagerClient implements ISecretsManagerClient {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	private static _instance: SecretsManagerClient;

	private _cache: Record<string, ICacheRecord> = {};

	private readonly _ttl: number;

	private readonly _secretsManagerClient: AWSSecretsManagerClient;

	private constructor() {
		this._ttl = DEFAULT_TTL;
		this._secretsManagerClient = new AWSSecretsManagerClient( { region: process.env.AWS_REGION ?? 'eu-central-1' } );
	}

	public async getSecretValue( secretName: string ): Promise<string> {
		const currentDate: number = ( new Date() ).getTime();

		if ( this._cache[ secretName ] && this._cache[ secretName ].expirationTime > currentDate ) {
			return this._cache[ secretName ].value;
		}

		let secretValue: string;

		try {
			secretValue = await this._fetchSecretValue( secretName );
		} catch ( error ) {
			console.error( `Failed to get secret value for secret name: ${ secretName }`, error );
			throw error;
		}

		this._cache[ secretName ] = {
			value: secretValue,
			expirationTime: currentDate + this._ttl
		};

		return this._cache[ secretName ].value;
	}

	public static getInstance(): SecretsManagerClient {
		if ( !SecretsManagerClient._instance ) {
			SecretsManagerClient._instance = new SecretsManagerClient();
		}

		return SecretsManagerClient._instance;
	}

	private async _fetchSecretValue( secretName: string ): Promise<string> {
		if ( process.env[ secretName ] ) {
			const value: string = process.env[ secretName ] ?? '';

			return value;
		}

		const response: GetSecretValueCommandOutput = await this._secretsManagerClient.send(
			new GetSecretValueCommand( {
				SecretId: process.env[ `${ secretName }_ID` ]
			} )
		);

		return response.SecretString!;
	}
}
