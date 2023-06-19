/* importing the React library  from the 'react' module. */
import React from "react";
import {MailFilled,GitlabFilled,LinkedinFilled } from '@ant-design/icons';


const Footer = () => {
  /* It renders a `footer` JSx*/
  return (
    <footer className="footer">
      <p>&copy; 2023 ReactChat App. All rights reserved | Saurabh Dixit.</p>
      <div className="developer-icons">
        <a href="mailto:smartds2550@gmail.com" target="_blank">
          <MailFilled className="icon" />
        </a>
        <a href="https://github.com/saurabhdixit93" target="_blank">
          <GitlabFilled className="icon" />
        </a>
        <a href="https://www.linkedin.com/in/saurabhdixit93" target="_blank">
          <LinkedinFilled className="icon" />
        </a>
      </div>
    </footer>
  );
};

/* exporting the `Footer` component as the default export of this module.*/
export default Footer;