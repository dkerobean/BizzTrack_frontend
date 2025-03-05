import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CardHeader from '@/components/shared/CardHeader';
import CardLoader from '@/components/shared/CardLoader';
import useCardTitleActions from '@/hooks/useCardTitleActions';
import { FiEdit, FiEye, FiTrash2, FiPlus } from 'react-icons/fi';
import Pagination from '@/components/shared/Pagination';
import HorizontalProgress from '@/components/shared/HorizontalProgress';
import AddProductModal from './AddProductModal';

const Product = ({ title }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Controls modal visibility

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, refreshKey]);

    if (isRemoved) return null;

    return (
        <div className="col-xxl-12">
            <div className={`card stretch stretch-full widget-tasks-content ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader
                    title={title}
                    refresh={handleRefresh}
                    remove={handleDelete}
                    expanded={handleExpand}
                />
                <div className="card-header border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Product List</h5>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <FiPlus size={16} className="me-2" />
                        Add Product
                    </button>
                </div>
                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Stock Level</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan="7" className="text-center text-muted py-4">No products found</td></tr>
                                ) : (
                                    products.map((product) => {
                                        const progress = ((product.stock / (product.stock + product.lowStockAlert)) * 100).toFixed(0);
                                        let brColor = 'success';
                                        if (progress < 30) brColor = 'danger';
                                        else if (progress < 60) brColor = 'warning';

                                        return (
                                            <tr key={product._id}>
                                                <td>
                                                    <div className="hstack gap-3">
                                                        <div className="avatar-image avatar-lg rounded">
                                                            <img className="img-fluid" src={product.images[0]} alt={product.name} />
                                                        </div>
                                                        <div>
                                                            <a href="#" className="d-block">{product.name}</a>
                                                            <span className="fs-12 text-muted">{product.category}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{product.description}</td>
                                                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                                <td className="text-dark fw-bold">${product.price.toFixed(2)}</td>
                                                <td className="text-dark fw-bold">{product.stock}</td>
                                                <td>
                                                    <div className="fs-12 fw-medium mb-2">{progress}% left</div>
                                                    <HorizontalProgress progress={progress} barColor={brColor} />
                                                </td>
                                                <td className="text-end">
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <a href="#" className="avatar-text avatar-md">
                                                            <FiEye />
                                                        </a>
                                                        <a href="#" className="avatar-text avatar-md">
                                                            <FiEdit />
                                                        </a>
                                                        <a href="#" className="avatar-text avatar-md">
                                                            <FiTrash2 />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer"> <Pagination /></div>
                <CardLoader refreshKey={refreshKey} />
            </div>

            {/* Add Product Modal */}
            <AddProductModal show={showModal} handleClose={() => setShowModal(false)} refreshProducts={fetchProducts} />
        </div>
    );
};

export default Product;