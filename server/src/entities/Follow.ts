import { BaseEntity, Entity, ManyToOne } from "typeorm";
import User from "./User";


//팔로 정보 엔티티
@Entity("follows")

export default class Follow extends BaseEntity {
    //팔로워
    @ManyToOne(() => User, (user) => user.followings)
    follower: User;

    //팔로잉
    @ManyToOne(() => User, (user) => user.followers)
    following: User;

}