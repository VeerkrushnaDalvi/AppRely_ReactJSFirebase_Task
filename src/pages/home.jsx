import React, { useRef } from 'react';
// import {firebase} from "../firebase";

import { firestore } from '../firebase';
import { addDoc, collection } from "@firebase/firestore";
import { fireEvent } from '@testing-library/react';
import { Form, Table, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function Home() {
    const msgRef = useRef();
    const msgRef2 = useRef();
    // const ref = collection(firestore, "messages")  // here messages is the name of collection
    const ref = collection(firestore, "UserCollection")  // here messages is the name of collection
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(msgRef.current.value)

        let data = {
            message: msgRef.current.value,
        }
        let udatadetails = {
            name: msgRef.current.value,
            email:msgRef2.current.value,
        }

        try {
            // addDoc(ref, data)
            addDoc(ref, udatadetails)
            alert("Saved in the database")
        } catch (e) {
            console.log(e)

        }
    };
    return (

        <Form style={{margin:100}} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName" >
                <Form.Label style={{float:'left', textDecoration:'bold', fontSize:25, fontWeight:'bold'}}>Enter Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name"  ref={msgRef}/> 
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail" >
                <Form.Label style={{float:'left', textDecoration:'bold', fontSize:25, fontWeight:'bold'}}>Enter your email</Form.Label>
                <Form.Control type="mail" placeholder="Enter mail"  ref={msgRef2}/> 
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
        // <div>
        //     <form onSubmit={handleSubmit} >

        //         <label htmlFor="">Enter Message</label>
        //         <input type="text" ref={msgRef} />
        //         <br />
        //         <button type="submit">Submit</button>
        //     </form>
        // </div>
    );
}
