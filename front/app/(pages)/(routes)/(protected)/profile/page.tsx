'use client'
import React from 'react'
import { useState } from 'react';

const Profile = () => {

  // const [task, setTask] = useState(["eat", "sleep"])
  // const [newTask, setNewTask] = useState('')

  // const addTask = () => {
  //   if(newTask !== '') {
  //     setTask([...task, newTask])
  //     setNewTask(newTask)
  //   }
  // }
  return (
    <div>
      {/* <div>
      {task.map((task, index) => (
        <li key={index}>{task}</li>
      ))}
      </div> */}

      <div>
        {/* <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)}/>
        <button onClick={addTask}>addTask</button> */}
      </div>
    </div>
  )
}

export default Profile;