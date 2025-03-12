import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'sonner';
import categories from '../../utils/fackData/categories.json'; 

const AddProductModal = ({ show, handleClose, refreshProducts }) => {
    const initialFormState = {
        name: '',
        description: '',
        price: '',
        stock: '',
        lowStockAlert: '',
        category: '',
        sku: '',
        organizationId: '67c58aa09078342e0b373466',
        images: []
    };

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const generateSKU = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let newSku = '';
        for (let i = 0; i < 9; i++) {
            newSku += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, sku: newSku });
    };

    const handleFileSelect = (e) => {
        setSelectedFiles([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        // Append all fields except images
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'images') data.append(key, value);
        });

        // Append images
        selectedFiles.forEach(file => {
            data.append('images', file);
        });

        console.log("🔍 Form Data Before Sending:");
        for (let pair of data.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/products`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success('Product added successfully!');

            // Reset the form and selected files
            setFormData(initialFormState);
            setSelectedFiles([]);

            refreshProducts();
            handleClose();
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Name *</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>SKU *</Form.Label>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={generateSKU}
                                    >
                                        Generate
                                    </Button>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Price *</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Stock Quantity *</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Low Stock Alert *</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="lowStockAlert"
                                    value={formData.lowStockAlert}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category *</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    name="organizationId"
                                    value={formData.organizationId}
                                    onChange={handleChange}
                                    required
                                    disabled
                                    hidden
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Images</Form.Label>
                                <Form.Control
                                    type="file"
                                    multiple
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                />
                                <div className="mt-1">
                                    {selectedFiles.length > 0 && (
                                        <div>Selected files: {selectedFiles.length}</div>
                                    )}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Product'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddProductModal;