import { Length } from 'class-validator';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany } from "typeorm"
import User from './User';
import Like from './Like';
import Retweet from './Retweet';
import Reply from './Reply';

//트윗 엔티티
@Entity("tweets")

export default class Tweet extends BaseEntity {

    //본문
    @Column()
    @Length(1, 300, {message: "300자 초과 불과"})
    content: string;

    // 트윗의 유저정보
    @ManyToOne (() => User, (user)=>user.tweets)
    user: User

    // 트윗의 좋아요수
    @OneToMany (() => Like, (like)=>like.tweet)
    likes: Like[];

    // 트윗의 알티수
    @OneToMany(() => Retweet, (retweet) => retweet.tweet)
    retweets: Retweet[];

    // 트윗의 답글
    @OneToMany(() => Reply, (reply) => reply.tweet)
    replies: Reply[];

}