import React, { useRef, useEffect, useState } from 'react';
// import {firebase} from "../firebase";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { db } from '../firebase';
import { addDoc, collection, getDocs } from "@firebase/firestore";
import { fireEvent } from '@testing-library/react';
import { Form, Table, Card, Button, CardBody } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function Home() {
    const todoName_ref = useRef();
    const todoDesc_ref = useRef();
    // const ref = collection(db, "messages")  // here messages is the name of collection
    const ref = collection(db, "UserCollection")  // here messages is the name of collection
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(msgRef.current.value)

        let todo = {
            todo_heading: todoName_ref.current.value,
            todo_description: todoDesc_ref.current.value,
        }
        // let udatadetails = {
        //     name: msgRef.current.value,
        //     email: msgRef2.current.value,
        // }

        try {
            // // addDoc(ref, data)
            // addDoc(ref, udatadetails)
            // alert("Saved in the database")
        } catch (e) {
            console.log(e)

        }
    };


    // Showing the code from database

    const [users, setUsers] = useState([]);


    const scrollref = useRef(undefined)
    function scroll() {
        scrollref.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
    // function showUserFromCollection() {
    //     const getUsers = async (e) => {
    //         const data = await getDocs(ref)
    //         setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //         console.log(data);
    //         scroll();
    //     };
    //     getUsers();

    // }



    return (
        <>
            <h1 style={{ textAlign: 'center', fontFamily:'Helvetica'}}> Todo Application </h1>
            <Card style={{ margin:0, padding:0 }} >
                <Form style={{ margin: 100, padding: 20 }} onSubmit={handleSubmit} className='border border-dark p-5'>

                    <Form.Group className="mb-3" controlId="formBasicName" >
                        <Form.Label style={{ float: 'left', textDecoration: 'bold', fontSize: 25, fontWeight: 'bold' }}>Todo task name: </Form.Label>
                        <Form.Control type="text" placeholder="Enter task name" ref={todoName_ref} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail" >
                        <Form.Label style={{ float: 'left', textDecoration: 'bold', fontSize: 25, fontWeight: 'bold' }}>Task description</Form.Label>
                        <Form.Control type="mail" placeholder="Enter description" ref={todoDesc_ref} />
                    </Form.Group>

                    <Button variant="outline-primary" type="submit">

                        Add task
                    </Button>

                </Form>
                {/* <Button variant="outline-primary" type="submit" onClick={showUserFromCollection} style={{ margin: 10,}}>
                    Show
                </Button> */}

            </Card>
            {users.map((user) => {
                return (
                    <div ref={scrollref}>
                        <Card>
                            <CardBody >
                                <h5>Name:&nbsp; &nbsp;{user.name}</h5>
                                <h5>Mail:&nbsp;  &nbsp; {user.email}</h5>
                            </CardBody>
                        </Card>
                    </div>
                );
            })}
        </>
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
