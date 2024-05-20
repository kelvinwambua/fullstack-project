import { Resolver, Ctx, Arg, Mutation, Field, InputType, ObjectType } from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../types";
import argon2 from "argon2";

// --- Input Types ---

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

// --- Response Types ---

@ObjectType()
class FieldError {
  @Field()
  field!: string;
  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

// --- User Resolver ---

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return { 
        errors: [{ field: "username", message: "length must be greater than 2" }] 
      };
    }
    if (options.password.length <= 5) {
      return { 
        errors: [{ field: "password", message: "length must be greater than 5" }] 
      };
    }

    const existingUser = await em.findOne(User, { username: options.username });
    if (existingUser) {
      return {
        errors: [{ field: "username", message: "username already taken" }],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      console.error("Error registering user:", err);
      return {
        errors: [{ field: "unknown", message: "An unexpected error occurred" }]
      };
    }
    return { user, errors: [] }; 
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [{ field: 'username', message: 'that username does not exist' }]
      };
    }

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return { 
        errors: [{ field: "password", message: "incorrect password" }],
      };
    }

    req.session.userId = user.id;

    return { user, errors: [] };
  }
}
