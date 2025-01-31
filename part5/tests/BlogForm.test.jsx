import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe } from 'vitest'
import BlogForm from '../src/components/BlogForm'
import blogService from '../src/services/blogs'

describe('<BlogForm />', () => {
  test('', async () => {
    // Mock the blog form event handler
    const createBlog = vi.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector('#blog-title')
    const authorInput = container.querySelector('#blog-author')
    const urlInput = container.querySelector('#blog-url')
    const createButton = screen.getByText('create')

    // Populate the form input fields and submit
    await user.type(titleInput, 'This is a test title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'https://testing-library.com/')
    await user.click(createButton)

    // Check that the mock handler is called once
    expect(createBlog.mock.calls).toHaveLength(1)

    // Check that the mock handler is called with the right details
    expect(createBlog.mock.calls[0][0]).toStrictEqual({
      title: 'This is a test title',
      author: 'Test Author',
      url: 'https://testing-library.com/'
    })
  })
})