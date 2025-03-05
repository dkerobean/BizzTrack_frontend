import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddProductModal = ({ show, handleClose, refreshProducts }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [lowStockAlert, setLowStockAlert] = useState('');
    const [category, setCategory] = useState('');
    const [sku, setSku] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [loading, setLoading] = useState(false);

    const generateSKU = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let newSku = '';
        for (let i = 0; i < 9; i++) {
            newSku += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setSku(newSku);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/product/create`,
                {
                    name,
                    description,
                    price: parseFloat(price),
                    stock: parseInt(stock, 10),
                    lowStockAlert: parseInt(lowStockAlert, 10),
                    category,
                    sku,
                    images: imageUrls.split('\n').map(url => url.trim()).filter(url => url),
                    organizationId: localStorage.getItem('organizationId')
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            refreshProducts();
            handleClose();
        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Stock Quantity</Form.Label>
                        <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Low Stock Alert Threshold</Form.Label>
                        <Form.Control type="number" value={lowStockAlert} onChange={(e) => setLowStockAlert(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>SKU</Form.Label>
                        <div className="d-flex">
                            <Form.Control type="text" value={sku} onChange={(e) => setSku(e.target.value)} required />
                            <Button variant="secondary" onClick={generateSKU} className="ms-2">
                                Generate
                            </Button>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Image URLs (one per line)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={imageUrls}
                            onChange={(e) => setImageUrls(e.target.value)}
                            placeholder="Enter each image URL on a new line"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Product'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddProductModal;