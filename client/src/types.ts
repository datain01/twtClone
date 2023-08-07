export interface User {
    username: string;
    nickname: string;
    introduce: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    tweets: string;
    followings: string[];
    followers: string[];

    profileUrn: string;
    profileUrl: string;
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
    userBookmark?: number;
}

export interface Reply {
    identifier: string;
    content: string;
    // username: string;
    createdAt: string;
    updatedAt: string;
    tweet?: Tweet;
    user: User;

    userLike: number;
    likeScore: number;
    userRetweet: number;
    retweetScore: number;
    userBookmark: number;
}

export interface Notification {
    id: string;
    type: string;
    sender: User;
    receiver: User;
    tweet: Tweet;
    like: string;
    retweet: string;
    reply: string;
    read: boolean;
}