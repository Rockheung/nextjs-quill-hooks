import dynamic from "next/dynamic";

const QuillWysiwyg = dynamic(import("../../components/QuillWysiwyg"), {
  loading: () => <h1>Loading</h1>,
  ssr: false
});

const Admin = props => {
  return (
    <div>
      <QuillWysiwyg />
    </div>
  );
};

// Admin.getInitialProps = async context => {
// };

export default Admin;
