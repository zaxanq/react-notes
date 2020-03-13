import React, { useContext } from 'react';
import './ConfirmDialog.scss';
import { UIContext } from '../../../../contexts';
import Button from '../../../Shell/components/Button/Button';
import Lang from '../../../../assets/i18n/en';

const ConfirmDialog = () => {
    const { confirmDialog } = useContext(UIContext);

    const onConfirmClick = () => {
        console.log('confirm');
    };

    const onCancelClick = () => {
        console.log('cancel');
    };

    const dialog = (
        <div className="dialog-container">
            <div className="dialog confirm-dialog">
                <p>{ confirmDialog.content }</p>
                <div className="confirm-dialog__controls">
                    <Button
                        type="submit"
                        buttonStyle="solid main"
                        className="confirm-dialog__confirm-button"
                        click={ () => onConfirmClick() }
                    >{ Lang.confirm.confirm }</Button>
                    <Button
                        type="cancel"
                        buttonStyle="solid gray"
                        className="confirm-dialog__cancel-button"
                        click={ () => onCancelClick() }
                    >{ Lang.confirm.cancel }</Button>
                </div>
            </div>
        </div>
    );

    return confirmDialog.visible ? dialog : '';
};

export default ConfirmDialog;
