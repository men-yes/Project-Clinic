import React from 'react'
import Header from './Header'
import '../CSScomponents/Specialization.css'

const Specialization = () => {
  return (
    <div id='specialization-section'>
        <h1 className="title-special">תחומי התמחות</h1>
        <div className='div-specialization'>
        
          <section className='speciali1'>
            <div className='speciali2'>NLP</div>
         </section>
          <section className='speciali1'>
            <div className='speciali2'>CBT</div>
         </section>
          <section className='speciali1'>
            <div className='speciali2'>DBT</div>
         </section>
          <section className='speciali1'>
            <div className='speciali2'> תרפיה התנהגותית BT</div>
         </section>
          <section className='speciali1'>
            <div className='speciali2'>מיינדפולנס MBCT</div>
         </section>
          <section className='speciali1'>
            <div className='speciali2'>תרפיה באומנות</div>
         </section>
          <section className='speciali1'>
            <div className='speciali2'>תרפיה במשחק</div>
         </section>
          <section className='speciali1'>
            <div className='speciali2'>תרפיה במוזיקה</div>
         </section>
        </div>
    </div>
  )
}

export default Specialization