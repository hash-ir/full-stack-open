import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe } from 'vitest'
import Blog from '../src/components/Blog'

describe('<Blog />', () => {
    let blog
    let container 

    /* `beforeAll` does not work with this setup as the testing library
    cleans up the DOM after each test; re-rendering of the component is
    required 
    
    `beforeEach` is the easiest fix and even more idiomatic in react
    testing library. Besides, the setup isn't expensive enough to
    warrant using `beforeAll`*/
    beforeEach(() => {
        blog = {
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
        container = render(
            <Blog 
                blog={blog} 
                updateBlogs={() => {}} 
                removeBlog={() => {}} 
                loggedUser={loggedUser}
            />
        ).container

    })

    test('renders title and author but not url or likes by default', () => {
        // Check that title and author are rendered as expected
        const divBlog = container.querySelector('.blog')
        expect(divBlog).toHaveTextContent(
            `${blog.title} ${blog.author}`
        )

        // Check that URL and likes are not rendered
        const divBlogDetails = container.querySelector('.blog-details')
        expect(divBlogDetails).toBeNull()
    })

    test('renders url and likes when \'view\' button is clicked', async () => {
        const user = userEvent.setup()
        const button = screen.getByRole('button', { name: 'view' })
        await user.click(button)
        expect(button).toHaveTextContent('hide')

        // Check that URL and likes are rendered
        const div = container.querySelector('.blog-details')
        // Performs a partial case-sensitive match when a string is passed
        expect(div).toHaveTextContent(`${blog.url} ${blog.likes}`)
    })
})

