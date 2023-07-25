export interface User {
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface Post {
    identifier: string;
    slug: string;
    content: string;
    // tweetName: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    
    url: string;
    userLike?: number;
    likeScore?: number;
    userRetweet?: number;
    retweetScore?: number;
    replyCount?: number;

    
}