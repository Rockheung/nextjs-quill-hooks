import { useRouter, Router } from "next/router";
import { withLayout } from "../../components/MyLayout";

const Post = () => {
  const router = useRouter();
  return (
    <>
      <h1>{router.query.id}</h1>
      <p>{JSON.stringify(router.query)}</p>
      <p>This is the blog post content.</p>
    </>
  );
};

export default withLayout(Post);
