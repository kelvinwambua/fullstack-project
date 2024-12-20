
import {
    Entity,
    BaseEntity,
    ManyToOne,
    PrimaryColumn,
    Column,
    JoinColumn,
  } from "typeorm";
  import { User } from "./User";
  import { Post } from "./Post";
  
  @Entity()
  export class Vote extends BaseEntity {
  
    @Column({ type: "int" })
    value: number;
  
  
    @PrimaryColumn()
    userId: number;
  
  
    @ManyToOne(() => User, (user) => user.votes)
    user: User;
  
    @PrimaryColumn()
    postId: number;
  
    @ManyToOne(() => Post, (post) => post.votes)
    @JoinColumn({ name: "postId" })
    post: Post;
  
    
  }