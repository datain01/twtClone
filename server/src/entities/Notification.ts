import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import BaseEntity from './Entity';
import User from "./User";
import Tweet from "./Tweet";
import Reply from "./Reply";
import Like from "./Like";
import Retweet from "./Retweet";

//알림 엔티티
@Entity("notifications")
export default class Notification extends BaseEntity {
    @Column()
    type: string; //답글, 리트윗, 좋아요 중에 어떤건지

    @ManyToOne(()=>User)
    @JoinColumn()
    sender: User; //알림을 보내는 사용자

    @ManyToOne(()=>User)
    @JoinColumn()
    receiver: User; //알림을 받은 사용자

    @ManyToOne(() => Tweet, {nullable: true,
        onDelete: "CASCADE"
    })
    tweet: Tweet;

    @ManyToOne(() => Like, {nullable: true,
        onDelete: "CASCADE"})
    like: Like;

    @ManyToOne(() => Retweet, {nullable: true,
        onDelete: "CASCADE"})
    retweet: Retweet;

    @ManyToOne(() => Reply, {nullable: true,
        onDelete: "CASCADE"})
    reply: Reply;

    @Column({nullable: true})
    read: boolean; //읽음 여부

   
}