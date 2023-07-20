import { Length } from 'class-validator';
import { Column, Entity, ManyToOne } from "typeorm";
import BaseEntity from './Entity';
import User from "./User";
import Tweet from './Tweet';


//답글 엔티티
@Entity("replies")
export default class Reply extends BaseEntity {

    @Column()
    @Length(1, 300, {message: "300자 초과 불과"})
    content: string;

    @ManyToOne (() => User, (user) => user.replies)
    user: User;

    @ManyToOne (() => Tweet, (tweet) => tweet.replies)
    tweet:Tweet;

}