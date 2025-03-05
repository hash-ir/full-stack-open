import { useState } from "react";
import blogService from "../services/blogs";
import { deleteBlog, likeBlog } from "../reducers/blogReducer";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

const Blog = ({ blog, loggedUser }) => {
  const [viewDetails, setViewDetails] = useState(false);
  // synchronize blog state as the 'like' button is pressed
  // const [localBlog, setLocalBlog] = useState(blog);
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const buttonLabel = viewDetails ? "hide" : "view";

  /* this works but if the like button is pressed too fast, the update
  is not equal to the number of times the button is pressed
  TODO: implement a fix! */
  const handleLike = async () => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1,
      // set user here explicitly to avoid mongoose schema violation
      user: blog.user.id,
    };

    dispatch(likeBlog(likedBlog))

    // const returnedBlog = await blogService.updateLikes(blog.id, updatedBlog);
    // required to update the likes displayed
    // setLocalBlog(returnedBlog);

    /* signal to parent to update the blogs list (which will include
    the new updates) */
    // if (updateBlogs) {
    //   await updateBlogs();
    // }
  };

  const handleRemove = (event) => {
    event.preventDefault();
    if (
      window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    ) {
      // removeBlog(blog.id);
      blogService.setToken(loggedUser.token)
      dispatch(deleteBlog(blog.id))
    }
  };

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={() => setViewDetails(!viewDetails)}>
        {buttonLabel}
      </button>
      {viewDetails && (
        <div className="blog-details">
          {blog.url} <br />
          <span data-testid="likes">{blog.likes}</span>{" "}
          <button onClick={handleLike}>like</button> <br />
          {blog.user.name} <br />
          {blog.user &&
            blog.user.username === loggedUser.username && (
              <button onClick={handleRemove}>remove</button>
            )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  // updateBlogs: PropTypes.func.isRequired,
  // removeBlog: PropTypes.func.isRequired,
  loggedUser: PropTypes.object.isRequired,
};

export default Blog;
