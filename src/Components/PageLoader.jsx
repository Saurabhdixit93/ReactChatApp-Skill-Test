import React from "react";
import "./loader.scss";

function PageLoader (){
    return(

        <section>
            <div className="loader">
                <div className="core"></div>
                <div className="elip elip1"></div>
                <div className="elip elip2"></div>
                <div className="elip elip3"></div>
            </div>
                <div className="loader shadow">
                <div className="core"></div>
                <div className="elip elip1"></div>
                <div className="elip elip2"></div>
                <div className="elip elip3"></div>
            </div>
        </section>

    );
};

export default PageLoader;