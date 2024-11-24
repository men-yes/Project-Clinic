import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className='footer'>
          <div className='footer-content'>
            <div className='footer-div'>
                <div className='item-div'> 🏥 כתובת המרפאה : נג'ארה 20</div>
                <div className='item-div'> ☎️ טלפון : 0527600974  </div>
                <div className='item-div'> 📧 צור קשר </div>
                <div className='item-div'> 🔍 אודות</div>
            </div>
            <div className='div-map'>
                <span>כך תמצאו אותנו בקלות</span>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!
               1m12!1m3!1d3391.2845433333514!2d35.19381122401728!3d31.
               789994274091637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.
               1!3m3!1m2!1s0x1502d649b4221fcb%3A0x5d2b29ad66dae766!
               2z16gnINeZ16nXqNeQ15wsINeo15HXmSDXmdep16jXkNecINeg15In15DXq
               NeUIDIwLCDXmdeo15XXqdec15nXnQ!5e0!3m2!1siw!2sil!4v1730305456022
               !5m2!1siw!2sil" 
               width="300" height="250"  allowfullscreen="" 
               loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
          <div className='footer-down'>
          <hr className="divider" />
          <div>  MAIMS כל הזכויות שמורות ©️   |  האתר נבנה ע"י סטודיו</div>
            </div>
        </footer>
    </div>
  )
}

export default Footer