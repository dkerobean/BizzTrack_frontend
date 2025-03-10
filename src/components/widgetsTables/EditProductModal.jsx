import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'sonner';

const EditProductModal = ({ show, handleClose, refreshProducts, product }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        lowStockAlert: '',
        category: '',
        sku: '',
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    // Load product data when product prop changes
    useEffect(() => {
        if (product && Object.keys(product).length > 0) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                stock: product.stock || '',
                lowStockAlert: product.lowStockAlert || '',
                category: product.category || '',
                sku: product.sku || '',
            });

            if (product.images && product.images.length > 0) {
                setExistingImages(product.images);
            }
        }
    }, [product]);

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

        // Append non-file fields
  Object.entries(formData).forEach(([key, value]) => {
    data.append(key, value);
  });

  // Append existing images
  data.append('existingImages', JSON.stringify(existingImages));

  // Append new images
  selectedFiles.forEach(file => {
    data.append('images', file);
  });

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${product._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success(`Product "${formData.name}" updated successfully!`);
            refreshProducts();
            handleClose();
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const removeExistingImage = (imageUrl) => {
        setExistingImages(existingImages.filter(img => img !== imageUrl));
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Product</Modal.Title>
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
                                <Form.Control
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
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

                        {/* Display existing images with option to remove */}
                        {existingImages.length > 0 && (
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Images</Form.Label>
                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                        {existingImages.map((img, index) => (
                                            <div key={index} className="position-relative" style={{ width: '100px' }}>
                                                <img src={img} alt={`Product ${index}`} className="img-thumbnail" />
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="position-absolute top-0 end-0"
                                                    onClick={() => removeExistingImage(img)}
                                                    style={{ padding: '0.1rem 0.3rem' }}
                                                >
                                                    &times;
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                        )}

                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Add New Images</Form.Label>
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
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Product'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditProductModal;