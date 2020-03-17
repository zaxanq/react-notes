import React, { useContext } from 'react';
import './Note.scss';
import { UIContext } from '../../contexts';

const Note = ({ data }) => {
    const contentLengthToDisplay = 255;
    const { singleNote } = useContext(UIContext);

    const content = data.content.length > 0 ?
        data.content :
        <span className="italic note__no-content">No contents.</span>;

    const shortContent = data.content.length > contentLengthToDisplay
        ? data.content.substr(0, contentLengthToDisplay) + '...'
        : content;

    const onNoteClick = () => {
        singleNote.setSelected(data);
        singleNote.setVisible(true);
    };

    return (
        <article
            className={ 'note' + (singleNote?.selected?.id === data.id ? ' selected-note' : '') }
            onDoubleClick={ () => onNoteClick() }
        >
            <h3
                className="title--with-underline note__title"
                onClick={ () => onNoteClick() }
            >{ data.title }</h3>
            <p className="note__content">{ shortContent }</p>
        </article>
    );
};

export default Note;
