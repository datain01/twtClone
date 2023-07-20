import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import BaseEntity from './Entity';
import User from "./User";
import Tweet from "./Tweet";
import Reply from "./Reply";

//좋아요 엔티티
@Entity("likes")
export default class Like extends BaseEntity {
    @Column()
    value: number;

    @ManyToOne(()=>User)
    @JoinColumn({name: "username", referencedColumnName: "username"})
    user: User;

    @Column()
    username: string;

    @Column({nullable: true})
    tweetId: number;

    @ManyToOne(()=>Tweet, (tweet)=>tweet.likes)
    tweet: Tweet;

    @Column({nullable: true})
    replyId: number;

    @ManyToOne(()=>Reply)
    reply: Reply;

}