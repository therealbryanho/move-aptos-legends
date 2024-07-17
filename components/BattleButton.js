import React, { useEffect, useState } from 'react'
import { GiSwordClash } from "react-icons/gi";
import styles from '../styles/Battle.module.css'
import Modal from 'react-bootstrap/Modal';
import axios from "axios";

const BattleButton = ({ imgUrl, jsonUrl }) => {
    const [nftNumber, setNftNumber] = useState(null)
    const [jsonData, setJsonData] = useState(null)
    const [loadingSelfStats, setLoadingSelfStats] = useState(true)
    const [battleDialogState, setBattleDialogState] = useState(false)

    const closeDialog = () => {
        setBattleDialogState(false)
    }

    useEffect(() => {
        let number = imgUrl.split(".jpg")[0].substring(imgUrl.split(".jpg")[0].length - 1, imgUrl.split(".jpg")[0].length)
        setNftNumber(number)

        if (battleDialogState) {
            getStats()
        }
    }, [imgUrl, battleDialogState])
    const getStats = async () => {
        setLoadingSelfStats(true)
        let jsonResponse = await axios.get(`${imgUrl.split("/image")[0]}/json/${nftNumber}.json`)
        console.log(jsonResponse.data);
        setJsonData(jsonResponse.data)
        setLoadingSelfStats(false)
    }


    return (
        nftNumber
        &&
        <>
            <button className={styles.battle_button} onClick={() => { setBattleDialogState(true) }}><GiSwordClash /> Enter Battle</button>
            <Modal show={battleDialogState} className="battle_dialog" onHide={closeDialog}>
                <Modal.Header style={{ borderColor: "#222" }}>
                    <Modal.Title><GiSwordClash style={{ fontSize: "2rem" }} /></Modal.Title>
                </Modal.Header>

                <Modal.Body className='w-100'>
                    <div>
                        <h2 className='text-center'>Battle Mode</h2>
                        <div className='my-5 d-flex justify-content-center align-items-center gap-5'>
                            <div className={`${styles.battle_nft} ${styles.my_nft}`}>
                                <img src={imgUrl} className={styles.nft_img} />
                                <div>
                                    <p>AP: {jsonData?.attributes[0]?.value}</p>
                                    <p>DP: {jsonData?.attributes[1]?.value}</p>
                                </div>
                            </div>
                            <p>v/s</p>
                            <div className={`${styles.battle_nft} ${styles.npc_nft}`}></div>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>
        </>

    )
}

export default BattleButton