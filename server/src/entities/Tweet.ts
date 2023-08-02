import { Length } from 'class-validator';
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { transliterate } from 'transliteration';
import BaseEntity from './Entity';
import User from './User';
import Like from './Like';
import Retweet from './Retweet';
import Reply from './Reply';
import { Exclude, Expose } from 'class-transformer';
import { makeId, slugify } from '../utils/helpers';

//트윗 엔티티
@Entity("tweets")
export default class Tweet extends BaseEntity {

    @Index()
    @Column()
    identifier: string;

    @Index()
    @Column()
    slug: string;

    //본문
    @Column()
    @Length(1, 300, {message: "300자 초과 불과"})
    content: string;

    // @Column()
    // tweetName: string;

    @Column()
    username: string;

    // 트윗의 유저정보
    @ManyToOne(() => User, (user) => user.tweets, {onDelete: "CASCADE"})
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User;


    // 트윗의 답글
    @Exclude()
    @OneToMany(() => Reply, (reply) => reply.tweet)
    replies: Reply[];

    // 트윗의 좋아요
    @Exclude()
    @OneToMany (() => Like, (like)=>like.tweet)
    likes: Like[];

    @Expose() get url(): string {
        return `${this.identifier}/${this.slug}`
    }

    //답글수
    @Expose()
    get replyCount(): number {
        return this.replies?.length;
    }

    //좋아요스코어
    @Expose() 
    get likeScore():number {
        return this.likes?.reduce((memo, curt) => memo + (curt.value || 0), 0);
    }

    //유저가 좋아요를 눌렀는지 안눌렀는지 확인하기
    protected userLike: number;

    setUserLike(user: User) {
        const index = this.likes?.findIndex(l => l.username === user.username);
        this.userLike = index > -1 ? this.likes[index].value : 0;
    }

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(7);
        const textPreview = this.content.slice(0, 7);
        const translatedText = transliterate(textPreview);
        this.slug = slugify(translatedText);
    }

    // 트윗의 알티
    @OneToMany(() => Retweet, (retweet) => retweet.tweet)
    retweets: Retweet[];

    // 알티 스코어
    @Expose() 
    get retweetScore():number {
        return this.retweets?.reduce((memo, curt) => memo + (curt.value || 0), 0);
    }

    protected userRetweet: number;
    setUserRetweet(user: User) {
        const index = this.retweets?.findIndex(r => r.username === user.username);
        this.userRetweet = index > -1 ? this.retweets[index].value : 0;
    }

}