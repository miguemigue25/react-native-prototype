import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';



// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register User
export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email, 
            password, 
            username
        )
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email, 
                username: username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

// Sign in
export const signIn = async (email, password) => {
    try {
        await account.deleteSession("current");
        const session = await account.createEmailPasswordSession(email, password);

        return session;        
    } catch (error) {
        throw new Error(error);
    }
}

// Get Account
export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);        
    }
}

// Get Current User


// Sign Out


// upload File


// Get File Preview


// Create Video Post


// Get All Video Posts


// Get Video Posts Created by User


// Get Video Posts that Matches Search Query


// Get Latest Created Video Posts