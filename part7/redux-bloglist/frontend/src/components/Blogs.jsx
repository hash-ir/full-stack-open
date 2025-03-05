import { useSelector } from "react-redux";
import Blog from "./Blog";
import PropTypes from "prop-types";

const Blogs = ({ loggedUser }) => {
  const blogs = useSelector(({ blogs, user }) => blogs)
  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          // synchronize local blog updates with parent
          // updateBlogs={updateBlogs}
          // removeBlog={removeBlog}
          loggedUser={loggedUser}
        />
      ))}
    </div>
  );
};

Blogs.propTypes = {
  // updateBlogs: PropTypes.func.isRequired,
  // removeBlog: PropTypes.func.isRequired,
  loggedUser: PropTypes.object.isRequired,
};

export default Blogs;
