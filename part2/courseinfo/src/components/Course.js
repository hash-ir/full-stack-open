const Course = (props) => {
    const courses = props.courses
    return (
        <div>
        {courses.map(course => 
            <div key={course.id}>
                <Header name={course.name} />
                <Content parts={course.parts} />
                <Total parts={course.parts} />
            </div>
        )}
        </div>
    )
}
  
const Header = ({ name }) => <h1>{name}</h1>

const Part = (props) => {
    return (
        <div>
            <p>
                {props.part} {props.exercises}
            </p>
        </div>
    )
}

const Content = (props) => {
    const parts = props.parts

    return (
        <div>
        {parts.map(part =>
            <Part key={part.id} part={part.name} exercises={part.exercises} />
        )}
        </div>
    )
}

const Total = ({ parts }) => {
    const total = parts.reduce((total, part) => {
        return total + part.exercises
    }, 0)
    return (
        <p><b>total of {total} exercises</b></p>
    )
}

export default Course