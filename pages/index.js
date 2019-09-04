import { Layout, withLayout } from "../components/MyLayout";
import Link from "next/link";

const data = [
  {
    link: "hello-nextjs",
    name: "박흥준",
    number: "010-7134-9409"
  },
  {
    link: "learn-nextjs",
    name: "박흥준",
    number: "010-7134-9409"
  },
  {
    link: "deploy-nextjs",
    name: "박흥준",
    number: "010-7134-9409"
  }
];

const PostLink = props => {
  return (
    <li>
      <Link
        href={`/p/[id]?name=${props.name}&number=${props.number}`}
        as={`/p/${props.link}`}
      >
        <a>{props.link}</a>
      </Link>
    </li>
  );
};

const Page = props => {
  return (
    <>
      <h1>My Blog</h1>
      <ul>
        {/* {console.log(props.data)} */}
        {props.data.map((item, idx) => (
          <PostLink key={idx} {...item} />
        ))}
      </ul>
    </>
  );
};

const Index = props => {
  return (
    <Layout>
      <Page {...props} />
    </Layout>
  );
};

Index.getInitialProps = async context => {
  console.log("GetInitialProps-Context: ", context);
  return {
    data
  };
};

export default Index;
