import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { API_ENDPOINT } from '../Api';
import { Dropdown, Button, Card, Col, Container, Form, Modal, Nav, Navbar, NavDropdown, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

import image1 from '/download (1).jpg';
import image2 from '/download (2).jpg';
import image3 from '/download (3).jpg';
import image4 from '/download (4).jpg';
import image5 from '/download (5).jpg';
import image6 from '/download (6).jpg';
import image7 from '/download (7).jpg';


const imageList = [image1, image2, image3, image4, image5, image6, image7];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState({ fullname: '', username: '', passwordx: '' });
  const navigate = useNavigate();

 
  useEffect(() =>{
    const fetchDecodedUserID = async () => {
      try {
        const response = JSON.parse(localStorage.getItem('token'))
        setUser(response.data);

        const decoded_token = jwtDecode(response.data.token);

        setUser(decoded_token);
      } catch (error) {
        navigate("/login");
      }
    }
    fetchDecodedUserID ();
  }, []);

  const handleLogout = async () =>{
    try {
      localStorage.removeItem('token');
      navigate("/login");
    } catch (error) {
      console.error('Logout failed', error);
    }
  } 


  const userdata = JSON.parse(localStorage.getItem('token'));
  const token = userdata.data.token;

  const headers = {
    accept: 'application/json',
    Authorization: token
  }

  useEffect(() =>{
    fetchUsers()
  },[])

  const fetchUsers = async () => {
    await axios.get(`${API_ENDPOINT}/user`, {headers: headers}).then(({data})=>{
      setUsers(data)
    })
  }

  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [passwordx, setPasswordx] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append('fullname', fullname)
    formData.append('username', username)
    formData.append('passwordx', passwordx)

    try {

      await axios.post(`${API_ENDPOINT}/user`, {fullname, username, passwordx}, { headers:headers }).then(({data})=>{
      Swal.fire({ icon: 'success', text: 'User created successfully!' });

      });
      setShowCreateModal(false);

      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      Swal.fire({
        icon: 'error',
        text: error.response?.data?.message || 'An error occurred.',
      });
    }
  };

  const getAuthHeaders = () => {
    const token = JSON.parse(localStorage.getItem('token'))?.data?.token;
    return { Authorization: `${token}` };
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
  
    console.log('Edit User:', editUser);
    console.log('Selected User:', selectedUser);
  
    try {
      const headers = getAuthHeaders();
      const payload = {
        fullname: editUser.fullname,
        username: editUser.username,
      };
  
      // Include passwordx only if it's not empty
      if (editUser.passwordx) {
        payload.passwordx = editUser.passwordx;
      }
  
      console.log('Payload for Update:', payload);
  
      const response = await axios.put(`${API_ENDPOINT}/user/${selectedUser.user_id}`, payload, { headers });
      
      // Log the successful response
      console.log('User Updated Successfully:', response);
  
      Swal.fire({ icon: 'success', text: 'User updated successfully!' });
      setShowEditModal(false); // Close modal after success
      fetchUsers(); // Refresh user list
    } catch (error) {
      // Log the error and show error message
      console.error('Error updating user:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        text: error.response?.data?.message || 'An error occurred.',
      });
    }
  };
  
  
  
  

  const handleDeleteUser = async (id) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',

    }).then((result) =>{
      return result.isConfirmed
    });

    if(!isConfirm){
      return;
    }

    await axios.delete(`${API_ENDPOINT}/user/${id}`,{headers:headers}).then(({data})=>{
      Swal.fire({
        icon:"success",
        text:"Succesfully Deleted"
      })
      fetchUsers()
    }).catch(({response:{data}})=>{
      Swal.fire({
        text:data.message,
        icon:"error"
      })
    })

  

  };

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Amira</Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Button variant="light" className="me-2" onClick={() => setShowUsersModal(true)}>
                Users
              </Button>
              <NavDropdown
                title={<img src="person-fill.svg" alt="User Icon" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />}
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item eventKey="disabled" disabled>
                  {user ? `User: ${user.username}` : 'Guest'}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#">Account</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={() => handleLogout()}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Row className="d-flex flex-wrap justify-content-center">
          {[...Array(7)].map((_, index) => (
            <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={index}>
              <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src={imageList[index]} />
              <Card.Body>
                  <Card.Title>House {index + 1}</Card.Title>
                  <Button variant="primary">Rent</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Users Modal */}
      <Modal show={showUsersModal} onHide={() => setShowUsersModal(false)} backdrop="static" fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.user_id}</td>
                  <td>{user.fullname}</td>
                  <td>{user.username}</td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowReadModal(true);
                      }}
                    >
                      Read
                    </Button>{' '}
                        <Button
                          variant="warning"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditUser({
                              fullname: user.fullname,
                              username: user.username,
                              passwordx: '', // Reset password field
                            });
                            setShowEditModal(true);
                          }}
                        >
                          Update
                        </Button>


                    <Button variant="danger" onClick={() => handleDeleteUser(user.user_id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="success" onClick={() => setShowCreateModal(true)} className="mt-3">
            Create User
          </Button>
        </Modal.Body>
      </Modal>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateUser}>
            <Form.Group controlId="formFullname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={fullname}
                onChange={(event) =>{setFullname(event.target.value)}} 
                required
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(event) =>{setUsername(event.target.value)}}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordx}
                onChange={(event) =>{setPasswordx(event.target.value)}}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Create User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditUser}>
            <Form.Group controlId="formFullname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={editUser.fullname}
                onChange={(e) => setEditUser({ ...editUser, fullname: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={editUser.username}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={editUser.passwordx}
                onChange={(e) => setEditUser({ ...editUser, passwordx: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3" >
              Update User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Read User Modal */}
      <Modal show={showReadModal} onHide={() => setShowReadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>ID:</strong> {selectedUser?.user_id}</p>
          <p><strong>Full Name:</strong> {selectedUser?.fullname}</p>
          <p><strong>Username:</strong> {selectedUser?.username}</p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Dashboard;