import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { auth, db, Logout } from "../firebase";
import { query, collection, getDocs, where, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
// import Home from "./home";
const Dashboard = () => {

    const [user, loading, error] = useAuthState(auth);

    console.log(`user: ${user}  loading: ${loading}    error: ${error}`);
    const [showModal, setShowModal] = useState(false);
    const [editTodo, setEditTodo] = useState({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("dummy@gmail.com");
    const [todolist, setTodolist] = useState([])
    const navigate = useNavigate();

    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            if (doc) {
                const data = doc.docs[0].data();
                console.log(data);
                // console.log(user.email);
                setName(data.name);
                setEmail(data.email);
            }


        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };


    const todoName_ref = useRef();
    const todoDesc_ref = useRef();
    // console.log(auth.currentUser.email);

    const ref = collection(db, email);  // here messages is the name of collection
    // const ref = collection(db, "messages")  // here messages is the name of collection
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
            addDoc(ref, todo);
            show_Todo();
            alert("Todo added !");


        } catch (e) {
            console.log(e)

        }
    };


    const show_Todo = async () => {
        try {
            const todo_data = await getDocs(ref);
            const todos = todo_data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            console.log(todos);
            setTodolist(todos);
        } catch (error) {
            console.error(error.message);
            alert("error occured while fetching todos try later");
        }
        // scroll();


    }



    const removeTodo = async (id) => {
        try {
            await deleteDoc(collection(db, email, id));
            // await deleteDoc(ref,(email,id));

            alert("Todo removed!");
            show_Todo();
        } catch (error) {
            console.error(error.message);
            alert("An error occurred while removing todo");
        }
    };





    const handleEdit = (todo) => {
        setEditTodo(todo);
        setShowModal(true);
    };


    const handleEditSubmit = async () => {
        try {
            await updateDoc(collection(db, email, editTodo.id), {
                todo_heading: todoName_ref.current.value,
                todo_description: todoDesc_ref.current.value,
            });
            alert("Todo updated!");
            setShowModal(false);
            show_Todo();
        } catch (error) {
            console.error(error.message);
            alert("An error occurred while updating todo");
        }
    };










    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        console.log(`user: ${user}  loading: ${loading}    error: ${error}`);
        fetchUserName();
        show_Todo();


    }, [user, loading, error]);



    return (

        <>

            <div className="dashboard">
                <div className="dashboard__container">
                    Logged in as  👋

                    <div style={{ backgroundColor: '#fff', padding: 20 }}> Name: {name}
                        <hr>
                        </hr>
                        Mail: {email}</div>
                    <br></br>

                    <Button variant="outline-dark" onClick={Logout}>Logout</Button>
                    <small style={{ fontStyle: 'italic', fontSize: 10 }}> White box represents the value which is fetched from firebase firestore</small>
                </div>
            </div >

            {/* ____________________________________________________ */}



            <h1 style={{ textAlign: 'center', fontFamily: 'Helvetica' }}> Todo Application </h1>
            <Card style={{ margin: 0, padding: 0 }} >
                <Form style={{ margin: 100, padding: 20 }} onSubmit={handleSubmit} className='border border-dark p-5'>

                    <Form.Group className="mb-3" controlId="formBasicName" >
                        <Form.Label style={{ float: 'left', textDecoration: 'bold', fontSize: 25, fontWeight: 'bold' }}>Todo task name: </Form.Label>
                        <Form.Control type="text" placeholder="Enter task name" ref={todoName_ref} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail" >
                        <Form.Label style={{ float: 'left', textDecoration: 'bold', fontSize: 25, fontWeight: 'bold' }}>Task description: </Form.Label>
                        <Form.Control type="mail" placeholder="Enter description" ref={todoDesc_ref} />
                    </Form.Group>

                    <Button variant="outline-primary" type="submit">

                        Add task
                    </Button>

                </Form>
                {/* <Button variant="outline-primary" type="submit" onClick={()=>show_Todo(ref)} style={{ margin: 10,}}>
                    Show
                </Button> */}

            </Card >



            {/* Display Todos */}
            <div className="todos-container">
                <h2>Your Todos</h2>
                <ul className="todo-list">
                    {todolist.map((todo) => (
                        <Card key={todo.id} className="todo-card">
                            <Card.Body>
                                <Card.Title>{todo.todo_heading}</Card.Title>
                                <Card.Text>{todo.todo_description}</Card.Text>
                                <div className="todo-buttons">
                                    <Button
                                        variant="info"
                                        onClick={() => handleEdit(todo)}
                                        className="mr-2"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => removeTodo(todo.id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </ul>
            </div>

            {/* Edit Todo Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Todo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Todo task name:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter task name"
                                ref={todoName_ref}
                                defaultValue={editTodo.todo_heading}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Task description:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                ref={todoDesc_ref}
                                defaultValue={editTodo.todo_description}
                            />
                        </Form.Group>

                        <Button
                            variant="outline-primary"
                            type="button"
                            onClick={() => handleEditSubmit()}
                        >
                            Update task
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>




        </>
    );
}


export default Dashboard;