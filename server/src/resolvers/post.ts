import { Resolver, Query, Arg, Mutation, InputType, Field, Ctx, UseMiddleware, Int, FieldResolver, Root } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { AppDataSource } from "../index";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string; 
}
@Resolver(Post)
export class PostResolver {
  @FieldResolver(()=>String)
    textSnippet(@Root() root: Post){
      if(root.text.length <= 50){
        return root.text;
      }
      return (`${root.text.slice(0,100)}....`);
    }
  
  @Query(() => [Post])
  async posts(
    @Arg("limit",()=>Int) limit: number,
    @Arg("cursor",()=> String,{nullable: true}) cursor: string | null
  ): Promise<Post[]> {
    const realLimit = Math.min(50,limit);
     
    const qb =AppDataSource.getRepository(Post).createQueryBuilder("p").orderBy('"createdAt"',"DESC").take(realLimit);
    if(cursor){
      qb.where('"createdAt" < :cursor',{cursor: new Date(parseInt(cursor))});
    }
    return qb.getMany();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | null> {
    return Post.findOneBy({id});
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input:PostInput,
    @Ctx(){req}:MyContext): Promise<Post> {
    

    return Post.create({...input, creatorId:req.session.userId  }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOneBy({id});
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}