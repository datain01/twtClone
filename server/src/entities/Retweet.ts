import { BaseEntity, Entity, ManyToOne } from "typeorm";
import User from "./User";
import Tweet from "./Tweet";

//리트윗 엔티티
@Entity("retweets")

export default class Retweet extends BaseEntity {
    @ManyToOne (() => User, (user)=>user.retweets)
    user: User

    @ManyToOne (() => Tweet, (tweet)=>tweet.retweets)
    tweet: Tweet
}