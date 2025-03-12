import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CardHeader from '@/components/shared/CardHeader';
import CardLoader from '@/components/shared/CardLoader';
import useCardTitleActions from '@/hooks/useCardTitleActions';
import { FiEdit, FiEye, FiTrash2, FiPlus } from 'react-icons/fi';
import Pagination from '@/components/shared/Pagination';
import HorizontalProgress from '@/components/shared/HorizontalProgress';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { toast } from 'sonner';

const Product = ({ title }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

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
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, refreshKey]);

    const handleEditClick = (product) => {
        setCurrentProduct(product);
        setShowEditModal(true);
    };

    const handleDeleteClick = async (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success(`Product "${productName}" deleted successfully`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error(error.response?.data?.message || 'Failed to delete product');
            }
        }
    };

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
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
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
                                        const progress = (product.stock / (product.stock + product.lowStockAlert)) * 100;
                                        let brColor = 'success';
                                        if (progress < 30) brColor = 'danger';
                                        else if (progress < 60) brColor = 'warning';

                                        return (
                                            <tr key={product._id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-image avatar-lg rounded me-3">
                                                            <img
                                                                src={product.images && product.images.length > 0
                                                                    ? `${import.meta.env.VITE_BACKEND_URL}/uploads/products/${product.images[0]}`
                                                                    : "/placeholder-product.jpg"}
                                                                alt={product.name}
                                                                onError={(e) => {
                                                                    e.target.src = "/placeholder-product.jpg";
                                                                    e.target.style.objectFit = "cover";
                                                                }}
                                                                style={{
                                                                    width: "80px",
                                                                    height: "80px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "4px",
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold">{product.name}</div>
                                                            <div className="text-muted">{product.category}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{product.description}</td>
                                                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                                <td className="text-dark fw-bold">${product.price?.toFixed(2)}</td>
                                                <td className="text-dark fw-bold">{product.stock}</td>
                                                <td>
                                                    <div className="fs-12 fw-medium mb-2">{progress.toFixed(0)}% left</div>
                                                    <HorizontalProgress progress={progress} barColor={brColor} />
                                                </td>
                                                <td className="text-end">
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button className="btn btn-icon" title="View Product">
                                                            <FiEye size={18} className="text-secondary" />
                                                        </button>
                                                        <button
                                                            className="btn btn-icon"
                                                            onClick={() => handleEditClick(product)}
                                                            title="Edit Product"
                                                        >
                                                            <FiEdit size={18} className="text-primary" />
                                                        </button>
                                                        <button
                                                            className="btn btn-icon"
                                                            onClick={() => handleDeleteClick(product._id, product.name)}
                                                            title="Delete Product"
                                                        >
                                                            <FiTrash2 size={18} className="text-danger" />
                                                        </button>
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
                <div className="card-footer"><Pagination /></div>
                <CardLoader refreshKey={refreshKey} />
            </div>

            <AddProductModal
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                refreshProducts={fetchProducts}
            />

            <EditProductModal
                show={showEditModal}
                handleClose={() => {
                    setShowEditModal(false);
                    setCurrentProduct(null);
                }}
                refreshProducts={fetchProducts}
                product={currentProduct}
            />
        </div>
    );
};

export default Product;