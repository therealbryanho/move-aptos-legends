import React from 'react'
import Modal from 'react-bootstrap/Modal';
import styles from '../styles/Home.module.css'
import { GiSwordClash } from 'react-icons/gi';


const CustomDialog = ({ show, closeDialog, dialogContent }) => {
    return (
        <Modal size='xl' show={show} className='battle_dialog' onHide={closeDialog}>
            {dialogContent}
        </Modal>
    )
}

export default CustomDialog