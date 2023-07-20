import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import BaseEntity from './Entity';
import User from "./User";
import Tweet from "./Tweet";
import Reply from "./Reply";

//리트윗 엔티티
@Entity("retweets")
export default class Retweet extends BaseEntity {
    @Column()
    value: number;

    @ManyToOne(()=>User)
    @JoinColumn({name: "username", referencedColumnName: "username"})
    user: User;

    @Column()
    username: string;

    @Column({nullable: true})
    tweetId: number;

    @ManyToOne(()=>Tweet, (tweet)=>tweet.retweets)
    tweet: Tweet;

    @Column({nullable: true})
    replyId: number;

    @ManyToOne(()=>Reply)
    reply: Reply;


    
}