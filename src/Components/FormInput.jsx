/* importing the React library and the useState hook from the 'react' module. */
import React, { useState } from "react";

const FormInput = (props) => {
    /* using the `useState` hook to create a state variable called `focused` and a function called `setFocused` to update the value of `focused`.. */
    const [focused , setFocused] = useState(false);

    /* This line of code is using object destructuring to extract specific properties from the `props` object passed to the `FormInput` component.*/
    const {errorMessage ,onChange , id , ...inputProps} = props;

  /**
   * The function sets the state of "focused" to true when called.
   */
    const handleFocused = (e) => {
        setFocused(true);
    }

   /* This is the JSX code that is being returned by the `FormInput` component.*/
    return(
        <div className="formInput">
           <input {...inputProps } 
                onChange={onChange} 
                onFocus={()=> inputProps.name === "confirmPassword" && setFocused(true)}
                onBlur = {handleFocused} 
                focused ={focused.toString()}
           />
           <span className="errorMessage">{errorMessage}</span>
        </div>
    );
}
/*  exporting the `FormInput` component as the default export of the module.*/
export default FormInput;