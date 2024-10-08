import { useState } from "react";

const Section = ({ title }) => <h1>{title}</h1>

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ props }) => {
  const {good, neutral, bad} = props
  const total = good + neutral + bad

  if (total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  const average = ((good * 1) + (neutral * 0) + (bad * -1)) / total
  // console.log('average', average)
  const positive = good * 100 / total + " %"

  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text='good' value={good} />
          <StatisticLine text='neutral' value={neutral} />
          <StatisticLine text='bad' value={bad} />
          <StatisticLine text='all' value={total} />
          <StatisticLine text='average' value={average} />
          <StatisticLine text='positive' value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // initialize counter for feedback types
  const [ stats, setStats] = useState({
    good: 0, neutral: 0, bad: 0
  })

  const handleGoodClick = () => {
    // console.log('pressed good, value before', stats.good)
    const newStats = {
      ...stats,
      good: stats.good + 1
    }
    setStats(newStats)
  }

  const handleNeutralClick = () => {
    // console.log('pressed neutral, value before', stats.neutral)
    const newStats = {
      ...stats,
      neutral: stats.neutral + 1
    }
    setStats(newStats)
  }

  const handleBadClick = () => {
    // console.log('pressed bad, value before', stats.bad)
    const newStats = {
      ...stats,
      bad: stats.bad + 1
    }
    setStats(newStats)
  }

  return (
    <div>
      <Section title="give feedback" />
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <Section title='statistics' />
      <Statistics props={stats} />
    </div>
  );
}

export default App;
