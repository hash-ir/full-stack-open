import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe } from 'vitest'
import Blog from '../src/components/Blog'
import blogService from '../src/services/blogs'

describe('<Blog />', () => {
    let blog
    let container
    let mockUpdateBlogs 

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

        mockUpdateBlogs = vi.fn()

        // Get the containing DOM node (div)
        container = render(
            <Blog 
                blog={blog} 
                updateBlogs={mockUpdateBlogs} 
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

    test('clicking the view button renders url and likes', async () => {
        const user = userEvent.setup()
        // Click the view button to show details
        const button = screen.getByRole('button', { name: 'view' })
        await user.click(button)
        expect(button).toHaveTextContent('hide')

        // Check that URL and likes are rendered
        const div = container.querySelector('.blog-details')
        // Performs a partial case-sensitive match when a string is passed
        expect(div).toHaveTextContent(`${blog.url} ${blog.likes}`)
    })

    test('clicking the like button twice calls event handler twice', async () => {
        const user = userEvent.setup()
        // First, click the view button to show details
        const viewButton = screen.getByRole('button', { name: 'view' })
        await user.click(viewButton)

        // Mock the entire blog service to avoid actual API calls
        vi.mock('../src/services/blogs', () => ({
            default: {
                // Mock the updateLikes function
                updateLikes: vi.fn()
            }
        }))
        
        /* Mock the return value of updateLikes
        mockResolvedValue is used here instead of mockReturnValue
        since updateLikes is an async function */
        blogService.updateLikes.mockResolvedValue({
            ...blog,
            likes: blog.likes + 1
        })

        // Find and click the like button twice
        const likeButton = screen.getByRole('button', { name: 'like' })
        await user.click(likeButton)
        await user.click(likeButton)
        
        // Following checks should be enough to know that the event
        // handler of like button was called twice 
        // Check that the updateLikes service was called twice
        expect(blogService.updateLikes.mock.calls).toHaveLength(2)

        // Check that updateBlogs was called twice
        expect(mockUpdateBlogs.mock.calls).toHaveLength(2)
    })
})

