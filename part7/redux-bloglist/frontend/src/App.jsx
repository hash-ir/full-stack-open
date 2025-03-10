import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import Blogs from "./components/Blogs";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
// import loginService from "./services/login";
import Notification from "./components/Notification";
import { setNotification } from "./reducers/notificationReducer";
import "./index.css";
import { createBlog, initializeBlogs } from "./reducers/blogReducer";
import { login, logout, setUser } from "./reducers/userReducer";

const App = () => {
  // const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState(null);
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  // control BlogForm component visibility from outside
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedUser");
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      // setUser(user);
      dispatch(setUser(user))
    }
    dispatch(initializeBlogs())
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    // const user = await loginService.login({ username, password });
    // setUser(user);
    dispatch(login(username, password))
    setUsername("");
    setPassword("");
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    dispatch(logout())
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      // only authenticated users can add blogs
      blogService.setToken(user.token);
      dispatch(createBlog(blogObject))
      dispatch(setNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        "success",
      ));
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      dispatch(setNotification(errorMessage["error"], "error"));
      console.error("Blog could not be added:", errorMessage);
    }
  };

  /* re-render the component when a blog is updated
  e.g., by clicking the 'like' button */
  // const updateBlogList = async () => {
  //   const blogs = await blogService.getAll();
  //   setBlogs(blogs.sort((a, b) => b.likes - a.likes));
  // };

  // const removeBlog = async (id) => {
  //   try {
  //     // only authenticated users can remove blogs
  //     blogService.setToken(user.token);
  //     await blogService.remove(id);
  //     updateBlogList();
  //   } catch (error) {
  //     const errorMessage = error.response ? error.response.data : error.message;
  //     console.error("Blog could not be added:", errorMessage);
  //   }
  // };

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm
          credentials={{ username, password }}
          setCredentials={{ setUsername, setPassword }}
          handleLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <Blogs
        // updateBlogs={updateBlogList}
        // removeBlog={removeBlog}
        loggedUser={user}
      />
    </div>
  );
};

export default App;
