import './Footer.css'
import React from 'react'

function goToFacebookPage(){
   window.location = 'https://www.facebook.com/fernando.r.dasilva.79';
}

export default props =>
    <footer className={"footer"}>
        <span>
            Made by
            <strong onClick={goToFacebookPage}> <span className={"setColor"}>N</span>an<span className={"setColor"}>D</span>o </strong><i className={"fa fa-heart setColor"}></i>
        </span>
    </footer>
