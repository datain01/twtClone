import { IsEmail, Length, Matches } from "class-validator";
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";
import bcrypt from 'bcryptjs';

import BaseEntity from './Entity';
import Follow from "./Follow";
import Tweet from "./Tweet";
import Retweet from "./Retweet";
import Reply from "./Reply";
import Like from "./Like";
import { Expose } from "class-transformer";

//유저 정보 엔티티
@Entity("users")
export default class User extends BaseEntity {

// 이메일 인스턴스
    @Index()
    @IsEmail(undefined, {message:"이메일 주소 형식이 올바르지 않습니다."})
    @Length(1, 255, {message:"이메일 주소는 비울 수 없습니다."})
    @Column({unique:true}) //중복 불가
    email:string;

// 유저네임
    @Index()
    @Length(2, 30, {message:"유저명은 2자 이상이어야 합니다."})
    @Matches(/^[A-Za-z0-9_-]+$/, {
        message: '유저명은 알파벳, 숫자, 밑줄, 대시만 포함할 수 있습니다.',
      })
    @Column({unique:true}) //중복 불가
    username:string;

// 비밀번호
    @Column()
    @Length(6, 30, {message:"비밀번호는 6자 이상이어야 합니다."})
    password:string;

// 닉네임
    @Column()
    @Length(1, 50, {message:"닉네임은 비울 수 없습니다."})
    nickname:string;

// 자기소개
    @Column({ nullable: true })
    introduce:string;

// 트윗
    @OneToMany(()=>Tweet, (tweet) => tweet.user)
    tweets: Tweet[];

// 팔로잉
    @OneToMany(()=>Follow, (follow) => follow.follower)
    followings: Follow[];

    @Column({default: 0})
    followingCount: number;
    
// 팔로워
    @OneToMany(()=>Follow, (follow) => follow.following)
    followers: Follow[];

    @Column({default: 0})
    followerCount: number;

// 좋아요
    @OneToMany(()=>Like, (like) => like.tweet)
    likes: Like[];

// 리트윗
    @OneToMany(()=>Retweet, (retweet) => retweet.tweet)
    retweets: Retweet[];

// 답글
    @OneToMany(()=>Reply, (reply) => reply.tweet)
    replies: Reply[];
    
//프로필 사진
    @Column({ nullable: true })
    profileUrn: string;

    @Expose()
    get profileUrl(): string {
        return this.profileUrn ? `${process.env.APP_URL}/images/${this.profileUrn}` :
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    }

// 헤더 사진
    @Column({ nullable: true })
    headerUrn: string;
    @Expose()
    get headerUrl(): string {
        return this.headerUrn ? `${process.env.APP_URL}/images/${this.headerUrn}` :
            undefined;
    }


// 비번 암호화
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6)
    }

}