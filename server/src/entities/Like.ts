import { Entity, ManyToOne } from "typeorm";
import BaseEntity from './Entity';
import User from "./User";
import Tweet from "./Tweet";

//좋아요 엔티티
@Entity("likes")
export default class Like extends BaseEntity {
    @ManyToOne(()=>User, (user)=>user.likes)
    user: User;

    @ManyToOne(()=>Tweet, (tweet)=>tweet.likes)
    tweet: Tweet;

}