export interface AuthServiceInterface {
    validate(email: string, password: string): Promise<any>;
    login(user: any): Promise<any>;
}