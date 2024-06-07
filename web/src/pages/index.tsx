 // index.tsx
 import { withUrqlClient } from "next-urql";
 import { NavBar } from "../components/NavBar";
 import { createUrqlClient } from "../utils/createUrqlClient";
 import { usePostsQuery } from "../generated/graphql";

 const index = () => {
     const[{data}] = usePostsQuery();
     return (
         <>
         <NavBar />
         {!data ? <div>Loading...</div>: data.posts.map((p) => <div key={p.id}>{p.title}{p.text}</div>)}
         </>
     );
 }


 export default withUrqlClient(createUrqlClient, {ssr: true})(index); 

