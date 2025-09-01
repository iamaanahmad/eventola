import { Client, Account, Databases, Storage, ID } from 'appwrite';
import appwriteConfig from '../../appwrite.config.json';

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { ID };
