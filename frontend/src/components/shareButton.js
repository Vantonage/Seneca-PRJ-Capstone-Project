import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {CopyToClipboard} from 'react-copy-to-clipboard';

function ShareButton({detailedPostId}) {
    const [show, setShow] = useState(false);
    const [url, setUrl] = useState("")

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setUrl(window.location.href + "/" + detailedPostId);
    }

    return (
        <>
            <Button variant="primary" className="share-link"><i className="fa-solid fa-share" onClick={handleShow}></i></Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Share Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                        <Row>
                            <Col sm={8}>
                                <input
                                    type="text"
                                    name="url"
                                    value={url}
                                    readOnly
                                />
                            </Col>
                            <Col sm={4}>
                                <CopyToClipboard text={url}>

                                <Button className="btn btn-blue">Copy</Button>
                                </CopyToClipboard>
                            </Col>
                        </Row>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ShareButton;