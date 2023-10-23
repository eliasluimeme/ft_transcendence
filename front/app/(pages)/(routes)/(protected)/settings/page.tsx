import MyForm from '@/components/ui/myForm'
import React from 'react'


const settings = () => {
  function addTask(name: any){
    alert(name);
  }

  return (
    <div>
      {/* <MyForm addTask ={addTask}/> */}
      settings
    </div>
  )
}

export default settings

