import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db, Logout } from "../firebase";
// import { Button} from "@mui/material";
import { Form, Button, Container, Nav, Navbar, NavDropdown, InputGroup, ListGroup, Stack, Modal } from "react-bootstrap";
import DeleteIcon from '@mui/icons-material/Delete';
import { query, collection, getDocs, where, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css"; // You can create a separate CSS file for styling




function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");

    const [todos, setTodos] = useState([]);
    const [todoHeading, settodoHeading] = useState('');
    const [todoDesc, settodoDesc] = useState('');
    // const [newTodo, setNewTodo] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);

    const [editedTodo, setEditedTodo] = useState({
        id: "",
        heading: "",
        description: "",
    });

    const currentUser = auth.currentUser;
    useEffect(() => {
        // console.log(currentUser.uid);
        setUser(currentUser);
        if (currentUser) {
            const userTodosCollection = collection(db, "Todo's_Collection", currentUser.email, "todos");
            const q = query(userTodosCollection);
            const fetchTodos = async () => {
                const querySnapshot = await getDocs(q);
                const todosData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTodos(todosData);
            };
            fetchTodos();
            fetchUserName(currentUser.uid);
        }

    }, []);


    // User name fetching for showing in the navbar from user database

    const fetchUserName = async (uid) => {
        try {
            const q = query(collection(db, "Users"), where("uid", "==", uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            console.log(data);
            setName(data.name);



        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };





    const addTodo = async () => {
        if (todoHeading.trim() !== "" && todoDesc.trim() !== "") {
            const userTodosCollection = collection(db, "Todo's_Collection", currentUser.email, "todos");
            await addDoc(userTodosCollection, { heading: todoHeading, description: todoDesc });
            // setNewTodo("");
            settodoHeading("");
            settodoDesc("");
            const q = query(userTodosCollection);
            const querySnapshot = await getDocs(q);
            const todosData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTodos(todosData);
        }
    };

    // const toggleTodo = async (todoId, completed) => {
    //     const userTodosCollection = collection(db, "Todo's_Collection", currentUser.email, "todos");
    //     const todoDocRef = doc(userTodosCollection, todoId);
    //     await updateDoc(todoDocRef, { completed: !completed });
    //     const q = query(userTodosCollection);
    //     const querySnapshot = await getDocs(q);
    //     const todosData = querySnapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));
    //     setTodos(todosData);
    // };




    const handleEdit = (todo) => {
        setEditedTodo({
            id: todo.id,
            heading: todo.heading,
            description: todo.description,
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditedTodo({
            ...editedTodo,
            [e.target.id]: e.target.value,
        });
    };

    const editTodo = async () => {
        try {
            const userTodosCollection = collection(
                db,
                "Todo's_Collection",
                currentUser.email,
                "todos"
            );
            const todoDocRef = doc(userTodosCollection, editedTodo.id);
            await updateDoc(todoDocRef, {
                heading: editedTodo.heading,
                description: editedTodo.description,
            });

            // Update state after editing
            const updatedTodos = todos.map((todo) =>
                todo.id === editedTodo.id ? editedTodo : todo
            );
            setTodos(updatedTodos);

            // Reset editedTodo and close modal
            setEditedTodo({
                id: "",
                heading: "",
                description: "",
            });
            setShowEditModal(false);
        } catch (error) {
            console.error("Error editing todo:", error);
        }
    };









    const deleteTodo = async (todoId) => {
        const userTodosCollection = collection(db, "Todo's_Collection", currentUser.email, "todos");
        const todoDocRef = doc(userTodosCollection, todoId);
        await deleteDoc(todoDocRef);
        const q = query(userTodosCollection);
        const querySnapshot = await getDocs(q);
        const todosData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setTodos(todosData);
    };

    return (
        <>
            <Navbar expand="lg" className="bg-body-secondary">
                <Container fluid>
                    <Navbar.Brand href="#">Todo Application</Navbar.Brand>

                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <InputGroup>
                            <InputGroup.Text id="basic-addon1"> <Navbar.Text>Hey 👋, @  {user && name}</Navbar.Text>  </InputGroup.Text>

                        </InputGroup>



                    </Nav>

                    <Button variant="outline-dark" onClick={() => Logout(navigate)}>Logout</Button>
                </Container>
            </Navbar>

            <div className="dashboard">
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicTodoName">
                        <Form.Label>Todo Heading</Form.Label>
                        <Form.Control type="text" placeholder="Enter todo name" value={todoHeading} onChange={(e) => settodoHeading(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="fromBasicTodoDesc">
                        <Form.Label>Todo Description</Form.Label>
                        <Form.Control type="text" placeholder="Enter todo description" value={todoDesc} onChange={(e) => settodoDesc(e.target.value)} />
                    </Form.Group>

                    <Button variant="outline-primary" type="submit" onClick={(e) => {
                        e.preventDefault();
                        addTodo()
                    }}>
                        Add todo
                    </Button>
                </Form>
            </div>

            {/* <div className="todos">
                    
                    <ul>
                        {todos.map((todo) => (
                            <li key={todo.id} className={todo.completed ? "completed" : ""}>
                                <span >
                                    {todo.heading}
                                </span>
                                <span >
                                    {todo.description}
                                </span>
                                <Button variant="outline-danger" onClick={() => deleteTodo(todo.id)}>
                                    Delete
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div> */}




            <Container className="mt-5">
                <h2>Todo List</h2>

                <ListGroup>
                    {todos.map((todo) => (
                        <ListGroup.Item key={todo.id} className="d-flex justify-content-between align-items-center" style={{ padding: 20 }}>
                            <div>
                                <h5>{todo.heading}</h5>
                                <p>{todo.description}</p>
                            </div>
                            <div>
                                <Stack direction="horizontal" gap={3}>

                                    <Button variant="outline-success" size="sm" className="mr-2 m-2" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleEdit(todo)
                                        }}>
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={(e)=>{
                                        e.preventDefault();
                                        deleteTodo(todo.id)}}>
                                        Delete
                                    </Button>
                                </Stack>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

            </Container>




            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Todo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="heading">
                            <Form.Label>Todo Heading:</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedTodo.heading}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Todo Description:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editedTodo.description}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={editTodo}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>


        </>
    );
}

export default Dashboard;
