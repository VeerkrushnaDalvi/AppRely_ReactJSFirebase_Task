
// importing all the required libraries
import React, { useEffect, useState } from "react";
import { auth, db, Logout } from "../firebase";
import { Form, Button, Container, Nav, Navbar, InputGroup, ListGroup, Stack, Modal } from "react-bootstrap";
import { query, collection, getDocs, where, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import "./Dashboard.css";
import 'bootstrap/dist/css/bootstrap.min.css';



function Dashboard() {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [todos, setTodos] = useState([]);
    const [todoHeading, settodoHeading] = useState('');
    const [todoDesc, settodoDesc] = useState('');
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



    // fetch user name function to show in the navbar as logged in status

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




    // add the user created todo in the firestore collection 
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



    //  handle edit button function
    const handleEdit = (todo) => {
        setEditedTodo({
            id: todo.id,
            heading: todo.heading,
            description: todo.description,
        });
        setShowEditModal(true);
    };


    // handle edit chnage function which change the seEdited todo in previous one
    const handleEditChange = (e) => {
        setEditedTodo({
            ...editedTodo,
            [e.target.id]: e.target.value,
        });
    };




    // edittodo function which updates the firestore
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








    // delete todo handle function
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


    // todo and dashboard(navbar) react coomponent
    return (
        <>
            {/* Navbar */}
            <Navbar expand="lg" className="bg-body-secondary">
                <Container fluid>
                    <Navbar.Brand href="#">Todo Application</Navbar.Brand>

                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <InputGroup>
                            <InputGroup.Text id="basic-addon1"> <Navbar.Text>Hey 👋, <FaCircleUser />  {user && name}</Navbar.Text>  </InputGroup.Text>

                        </InputGroup>
                    </Nav>

                    <Button variant="outline-dark" onClick={() => Logout(navigate)}>Logout</Button>
                </Container>
            </Navbar>

            {/* todo input (heading and description) */}
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



            {/* Container used to show the todo list */}
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
                                        Edit <MdEdit />
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={(e) => {
                                        e.preventDefault();
                                        deleteTodo(todo.id)
                                    }}>
                                        Delete <MdDelete />
                                    </Button>
                                </Stack>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

            </Container>



            {/* Modal for editing the todo */}
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
