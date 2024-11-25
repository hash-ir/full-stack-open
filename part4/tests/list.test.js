const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const logger = require('../utils/logger')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    const listWithManyBlogs = [
        {
            _id: "67437241a60ec4695bcbc931",
            title: "How to Ace Machine Learning Interviews: My Personal Playbook",
            author: "Kartik Singhal",
            url: "https://medium.com/@kgk.singhal/how-to-ace-machine-learning-interviews-my-personal-playbook-a75794155157",
            likes: 928,
            __v: 0
        },
        {
            _id: "67440724b9c4f58f98e11974",
            title: "The 37 Best Websites to Learn Something New",
            author: "Kristyna Zapletal",
            url: "https://kristynazapletal.medium.com/the-37-best-websites-to-learn-something-new-895e2cb0cad4",
            likes: 38295,
            __v: 0
        },
        {
            _id: "67440e1112f25b2599576b3e",
            title: "The Crossroads of Should and Must",
            author: "elle luna",
            url: "https://medium.com/@elleluna/the-crossroads-of-should-and-must-90c75eb7c5b0",
            likes: 34519,
            __v: 0
        }
    ]

    test('when list has many blogs, equals the sum of likes of each blog', () => {
        const result = listHelper.totalLikes(listWithManyBlogs)
        assert.strictEqual(result, 928 + 38295 + 34519)
    })

    const listWithNoBlog = []

    test('when list has no blog, equals 0', () => {
        const result = listHelper.totalLikes(listWithNoBlog)
        assert.strictEqual(result, 0)
    })
}) 