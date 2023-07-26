export interface User {
    username: string;
    nickname: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    tweets: string;
    followings: string[];
    followers: string[];
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

export interface Tweet {
    identifier: string;
    slug: string;
    content: string;
    user:User;
    createdAt: string;
    updatedAt: string;
    url: string;
    userLike?: number;
    likeScore?: number;
    userRetweet?: number;
    retweetScore?: number;
    replyCount?: number;
}