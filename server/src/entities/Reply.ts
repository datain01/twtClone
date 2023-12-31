import { Length } from 'class-validator';
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { makeId } from "../utils/helpers";
import BaseEntity from './Entity';
import User from "./User";
import Tweet from './Tweet';
import { Exclude, Expose } from 'class-transformer';
import Like from './Like';
import Retweet from './Retweet';
import Bookmark from './Bookmark';


//답글 엔티티
@Entity("replies")
export default class Reply extends BaseEntity {

    @Index()
    @Column()
    identifier: string;


    @Column()
    @Length(1, 300, {message: "300자 초과 불과"})
    content: string;

    @Column()
    username: string;

    @ManyToOne (() => User)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User

    @Column()
    tweetId: number;

    @ManyToOne(() => Tweet, (tweet) => tweet.replies, { nullable: false,  onDelete: "CASCADE" })
    tweet: Tweet;

    
    // 좋아요 시작!!!!!!
    // 트윗의 좋아요
    @Exclude()    
    @OneToMany (() => Like, (like)=>like.reply)
    likes: Like[];

    //유저가 좋아요를 눌렀는지 안눌렀는지 확인하기
    protected userLike: number;

    setUserLike(user: User) {
        const index = this.likes?.findIndex(l => l.username === user.username);
        this.userLike = index > -1 ? this.likes[index].value : 0;
    }

    //좋아요수
    @Expose() 
    get likeScore(): number {
        const initialValue = 0
        return this.likes?.reduce((previousValue, currentObject) =>
            previousValue + (currentObject.value || 0), initialValue)
    }
    // 좋아요 끝!!!!!

    // 리트윗 시작!!!!!
    @Exclude()
    // 트윗의 리트윗
    @OneToMany (() => Retweet, (retweet)=>retweet.reply)
    retweets: Retweet[];

    //유저가 리트윗을 눌렀는지 안눌렀는지 확인하기
    protected userRetweet: number;

    setUserRetweet(user: User) {
        const index = this.retweets.findIndex(r => r.username === user.username);
        this.userRetweet = index > -1 ? this.retweets[index].value : 0;
        
    }

    //리트윗
    @Expose() 
    get retweetScore():number {
        const initialValue = 0
        return this.retweets?.reduce((previousValue, currentObject) =>
            previousValue + (currentObject.value || 0), initialValue)
    }
    // 리트윗 끝!!!!!

    @BeforeInsert()
    makeId() {
        this.identifier = makeId(8);
    }


    @Exclude()    
    @OneToMany (() => Bookmark, (bookmark)=>bookmark.reply)
    bookmarks: Bookmark[];

    protected userBookmark: number;

    setUserBookmark(user: User) {
        const index = this.bookmarks?.findIndex(b => b.username === user.username);
        this.userBookmark = index > -1 ? this.bookmarks[index].value : 0;
    }


}