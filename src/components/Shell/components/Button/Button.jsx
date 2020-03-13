import React from 'react';
import './Button.scss';

const Button = ({ children, type, buttonStyle, className, click }) => {
    /*
        type: string - defines type of string, i.e. 'button', 'submit', 'reset'
        buttonStyle: string - defines single or multiple styles of button, they serve as modifiers in button classes
            i.e. type 'solid' will result in className 'button--solid'
        className: string - defines single or multiple classNames for the button
        click: function - onClick button function
     */
    const getStyleClasses = () => {
        /*
            method takes 'buttonStyle' parameter, a single style, i.e. 'solid' will create a single class .e. 'button--solid'.
            If there are multiple styles, i.e. 'solid dark' there will be multiple classes added.
         */
        if (buttonStyle.includes(' ')) {
            buttonStyle = buttonStyle
                .split(' ')
                .map((item) => `button--${ item }`)
                .join(' ');
        } else {
            buttonStyle = 'button--' + buttonStyle;
        }
        return buttonStyle;
    };

    return (
        <button
            type={ type }
            className={ `button ${getStyleClasses()} ${ className }` }
            onClick={ click ? (e) => click(e) : undefined }
        >
            { children }
        </button>
    );
};

export default Button;
