import React from 'react';
import './Button.scss';

const Button = ({ children, type, style, className, click }) => {
    const getStyleClasses = () => {
        if (style.includes(' ')) {
            style = style
                .split(' ')
                .map((item) => `button--${item}`)
                .join(' ');
        } else {
            style = 'button--' + style;
        }
        return style;
    };

    return (
        <button
            type={ type }
            className={ `button ${getStyleClasses()} ${className}` }
            onClick={ () => click() }
        >
            { children }
        </button>
    );
};

export default Button;
