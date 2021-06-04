import loadingImage from "../../../assets/image/spinner2.gif";
import React from "react";

let Preloader = (props) => {
    return <div>
        <img src={loadingImage}/>
    </div>
}

export default Preloader