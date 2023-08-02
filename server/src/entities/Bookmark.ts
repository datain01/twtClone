import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import BaseEntity from './Entity';
import User from "./User";
import Tweet from "./Tweet";
import Reply from "./Reply";

//좋아요 엔티티
@Entity("bookmarks")
export default class Bookmark extends BaseEntity {
    @Column()
    value: number;

    @ManyToOne(()=>User)
    @JoinColumn({name: "username", referencedColumnName: "username"})
    user: User;

    @Column()
    username: string;

    @Column({nullable: true})
    tweetId: number;

    @ManyToOne(()=>Tweet, (tweet)=>tweet.bookmarks, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    tweet: Tweet;

    @Column({nullable: true})
    replyId: number;

    @ManyToOne(()=>Reply, {
        onDelete: "CASCADE"
    })
    reply: Reply;

}