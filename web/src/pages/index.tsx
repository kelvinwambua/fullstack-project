 // index.tsx
 import { withUrqlClient } from "next-urql";
 import { NavBar } from "../components/NavBar";
 import { createUrqlClient } from "../utils/createUrqlClient";
 import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from 'next/link'
import Link from "next/link";

 const index = () => {
     const[{data}] = usePostsQuery();
     return (
         <Layout>
            <NextLink href={"/create-post"}>
                <p>Create Post</p>
            </NextLink>
         {!data ? <div>Loading...</div>: data.posts.map((p) => <div key={p.id}>{p.title}{p.text}</div>)}
         </Layout>
     );
 }


 export default withUrqlClient(createUrqlClient, {ssr: true})(index); 

