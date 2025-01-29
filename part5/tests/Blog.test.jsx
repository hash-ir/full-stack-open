import { render } from '@testing-library/react'
import { describe } from 'vitest'
import Blog from '../src/components/Blog'


describe('<Blog />', () => {
    test('renders title and author but not url or likes by default', () => {
        const blog = {
            title: 'Component testing is done with react-testing-library',
            author: 'Test Author',
            url: 'https://testing-library.com/',
            likes: 5,
            user: {
                username: 'testuser',
                name: 'Test User'
            }
        }

        const loggedUser = {
            username: 'testuser',
            name: 'Test User' 
        }
        
        // Get the containing DOM node (div)
        const { container } = render(
            <Blog 
                blog={blog} 
                updateBlogs={() => {}} 
                removeBlog={() => {}} 
                loggedUser={loggedUser}
            />
        )

        // Check that title and author are rendered as expected
        const divBlog = container.querySelector('.blog')
        expect(divBlog).toHaveTextContent(
            `${blog.title} ${blog.author}`
        )

        // Check that URL and likes are not rendered
        const divBlogDetails = container.querySelector('.blog-details')
        expect(divBlogDetails).toBeNull()
    })
})

