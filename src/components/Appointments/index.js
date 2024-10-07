// Write your code here
import {Component} from 'react'
import {format} from 'date-fns'
import {v4} from 'uuid'
import AppointmentItem from '../AppointmentItem'
import './index.css'

let savedAppointmentsList = JSON.parse(localStorage.getItem('appointmentsList'))
if (savedAppointmentsList === null) {
  savedAppointmentsList = []
}

class Appointments extends Component {
  state = {
    title: '',
    date: '',
    appointmentsList: savedAppointmentsList,
    isFilterActive: false,
  }

  getFilteredAppointmentsList = () => {
    const {appointmentsList, isFilterActive} = this.state

    if (isFilterActive) {
      return appointmentsList.filter(each => each.isStarred === true)
    }
    return appointmentsList
  }

  onAddAppointment = event => {
    event.preventDefault()
    const {title, date} = this.state
    const formattedDate = date
      ? format(new Date(date), 'dd MMMM yyyy, EEEE')
      : ''

    const newAppointment = {
      id: v4(),
      title,
      date: formattedDate,
      isStarred: false,
    }

    this.setState(prevState => ({
      appointmentsList: [...prevState.appointmentsList, newAppointment],
      title: '',
      date: '',
    }))
  }

  onChangeTitle = event => {
    this.setState({title: event.target.value})
  }

  onChangeDate = event => {
    this.setState({date: event.target.value})
    console.log(event.target.value)
  }

  onFilter = () => {
    const {isFilterActive} = this.state

    this.setState({
      isFilterActive: !isFilterActive,
    })
  }

  toggleIsStarred = id => {
    this.setState(prevState => ({
      appointmentsList: prevState.appointmentsList.map(each => {
        if (id === each.id) {
          return {...each, isStarred: !each.isStarred}
        }
        return each
      }),
    }))
  }

  onSave = () => {
    const {appointmentsList} = this.state
    localStorage.setItem('appointmentsList', JSON.stringify(appointmentsList))
  }

  render() {
    const {title, date, isFilterActive} = this.state
    const filClassName = isFilterActive ? 'filter-filtered' : 'filter-empty'
    const filteredAppointmentsList = this.getFilteredAppointmentsList()

    return (
      <div className="app-container">
        <div className="responsive-container">
          <div className="appointments-container">
            <div className="add-appointment-container">
              <form className="form" onSubmit={this.onAddAppointment}>
                <h1 className="add-appointments-head">Add Appointment</h1>
                <label className="label" htmlFor="title">
                  TITLE
                </label>
                <input
                  type="text"
                  id="title"
                  className="input"
                  value={title}
                  onChange={this.onChangeTitle}
                />
                <label htmlFor="date" className="label">
                  DATE
                </label>
                <input
                  type="date"
                  id="date"
                  className="input"
                  value={date}
                  onChange={this.onChangeDate}
                />
                <div className="btn-container">
                  <button type="submit" className="add-btn">
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={this.onSave}
                    className="add-btn"
                  >
                    Save
                  </button>
                </div>
              </form>
              <img
                src="https://assets.ccbp.in/frontend/react-js/appointments-app/appointments-img.png"
                className="appointments-img"
                alt="appointments-img"
              />
            </div>
            <hr className="line-break" />
            <div className="list-with-starred">
              <h1 className="appointments-head">Appointments</h1>
              <button
                type="button"
                className={`starred-btn ${filClassName}`}
                onClick={this.onFilter}
              >
                Starred
              </button>
            </div>
            <ul className="appointments-list">
              {filteredAppointmentsList.map(each => (
                <AppointmentItem
                  key={each.id}
                  appointmentDetails={each}
                  toggleIsStarred={this.toggleIsStarred}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Appointments
