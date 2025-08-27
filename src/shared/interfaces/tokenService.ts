export interface ITokenService {
	generate(payload: any): Promise<string>;
	verify(token: string): Promise<any>;
}
